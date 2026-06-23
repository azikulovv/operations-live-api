import type { Prisma } from '@prisma/client'

import { isExternalApiError } from '@/api/api.client'
import { badRequest, notFound } from '@/common/errors/app-error'
import { prisma } from '@/database/prisma'
import { presentBartenderSaleListItem } from '@/modules/bartender-sales/bartender-sales.presenter'
import { emitBartenderSaleListUpdated } from '@/modules/bartender-sales/bartender-sales.realtime'
import { BartenderSalesRepository } from '@/modules/bartender-sales/bartender-sales.repository'
import { presentDebtListItem } from '@/modules/debts/debts.presenter'
import { emitDebtListUpdated } from '@/modules/debts/debts.realtime'
import { DebtsRepository } from '@/modules/debts/debts.repository'
import { mapExternalEventToCreateInput } from '@/modules/events/events.mapper'
import { EventsRepository } from '@/modules/events/events.repository'
import { presentFinalTableListItem } from '@/modules/final-table/final-table.presenter'
import { isEligibleForFinalTable } from '@/modules/final-table/final-table.eligibility'
import { emitFinalTableListUpdated } from '@/modules/final-table/final-table.realtime'
import { FinalTableRepository } from '@/modules/final-table/final-table.repository'
import { presentPaymentListItem } from '@/modules/payments/payments.presenter'
import { emitPaymentListUpdated } from '@/modules/payments/payments.realtime'
import { PaymentsRepository } from '@/modules/payments/payments.repository'
import { fetchEventParticipants } from '@/modules/participants/participants.external-client'
import {
  mapExternalParticipantToCreateInput,
  mapExternalParticipantToSyncUpdateInput,
} from '@/modules/participants/participants.mapper'
import { ParticipantsRepository } from '@/modules/participants/participants.repository'
import {
  emitParticipantListUpdated,
  emitParticipantUpdated,
} from '@/modules/participants/participants.realtime'
import type { UpdateParticipantDto } from '@/modules/participants/participants.schemas'
import type { ExternalParticipant } from '@/modules/participants/participants.types'
import { presentPromotionListItem } from '@/modules/promotions/promotions.presenter'
import { emitPromotionListUpdated } from '@/modules/promotions/promotions.realtime'
import { PromotionsRepository } from '@/modules/promotions/promotions.repository'
import { presentTournamentListItem } from '@/modules/tournament/tournament.presenter'
import { emitTournamentListUpdated } from '@/modules/tournament/tournament.realtime'
import { TournamentRepository } from '@/modules/tournament/tournament.repository'

export class ParticipantsService {
  private readonly eventsRepository = new EventsRepository(prisma)
  private readonly participantsRepository = new ParticipantsRepository(prisma)
  private readonly bartenderSalesRepository = new BartenderSalesRepository(prisma)
  private readonly debtsRepository = new DebtsRepository(prisma)
  private readonly finalTableRepository = new FinalTableRepository(prisma)
  private readonly paymentsRepository = new PaymentsRepository(prisma)
  private readonly promotionsRepository = new PromotionsRepository(prisma)
  private readonly tournamentRepository = new TournamentRepository(prisma)

  async getEventParticipants(externalEventId: string) {
    const event = await this.syncEventParticipantsIfAvailable(externalEventId)
    return this.participantsRepository.findByEventId(event.id)
  }

  async syncEventParticipantsIfAvailable(externalEventId: string) {
    try {
      return await this.syncEventParticipants(externalEventId)
    } catch (error) {
      if (!isExternalApiError(error) || error.statusCode !== 404) {
        throw error
      }

      const event = await this.eventsRepository.findByExternalId(externalEventId)
      if (!event) {
        throw notFound('Событие не найдено')
      }

      return {
        id: event.id,
        created: 0,
        skipped: 0,
      }
    }
  }

  async syncEventParticipants(externalEventId: string) {
    const response = await fetchEventParticipants(externalEventId)
    const event = await this.findOrCreateEvent(response.event)
    const externalParticipants = this.uniqueByExternalId(response.participants)
    const externalParticipantIds = externalParticipants.map(participant => participant.id)
    const existingExternalIds =
      await this.participantsRepository.findExternalIds(externalParticipantIds)

    const participantsToCreate = externalParticipants
      .filter(participant => !existingExternalIds.has(participant.id))
      .map(participant =>
        mapExternalParticipantToCreateInput(
          participant,
          event.id,
          event.initialDepositAmount,
        ),
      )
    const participantsToUpdate = externalParticipants
      .filter(participant => existingExternalIds.has(participant.id))
      .map(participant => ({
        externalId: participant.id,
        data: mapExternalParticipantToSyncUpdateInput(
          participant,
          event.initialDepositAmount,
        ),
      }))

    const [createResult, updateResult, cancelResult] = await Promise.all([
      this.participantsRepository.createMany(participantsToCreate),
      this.participantsRepository.updateExternalSyncFields(participantsToUpdate),
      this.participantsRepository.markMissingExternalIdsAsCancelled(
        event.id,
        externalParticipantIds,
      ),
    ])
    await this.paymentsRepository.createMissingInitialPaymentsForEvent(event.id)

    return {
      id: event.id,
      created: createResult.count,
      updated: updateResult.count,
      cancelled: cancelResult.count,
      skipped: externalParticipants.length - createResult.count - updateResult.count,
    }
  }

  async updateParticipant(participantId: string, dto: UpdateParticipantDto) {
    await this.ensureParticipantCanBeEdited(participantId)

    const participant = await this.participantsRepository.updateByParticipantId(participantId, dto)
    const eventId = participant.event.externalId

    if (!isEligibleForFinalTable(participant)) {
      await this.finalTableRepository.deleteByParticipantId(participantId)
    }

    const list = await this.participantsRepository.findByEventId(participant.event.id)

    emitParticipantUpdated({
      eventId,
      participantId,
      participant,
    })

    emitParticipantListUpdated(eventId, list)
    await this.emitOperationalListsUpdated(eventId)

    return participant
  }

  async ensureParticipantCanBeEdited(participantId: string) {
    const participant = await this.participantsRepository.findStatusByParticipantId(participantId)

    if (!participant) {
      throw notFound('Участник не найден')
    }

    if (participant.status.toUpperCase() === 'CANCELLED') {
      throw badRequest('Нельзя изменить данные отмененного участника')
    }
  }

  private async emitOperationalListsUpdated(eventId: string) {
    await this.finalTableRepository.reconcileAutomaticFinalTable(eventId)

    const [bartenderSales, debts, finalTable, payments, promotions, tournament] = await Promise.all(
      [
        this.bartenderSalesRepository.findListByExternalEventId(eventId),
        this.debtsRepository.findListByExternalEventId(eventId),
        this.finalTableRepository.findListByExternalEventId(eventId),
        this.paymentsRepository.findListByExternalEventId(eventId),
        this.promotionsRepository.findListByExternalEventId(eventId),
        this.tournamentRepository.findListByExternalEventId(eventId),
      ],
    )

    emitBartenderSaleListUpdated(eventId, bartenderSales.map(presentBartenderSaleListItem))
    emitDebtListUpdated(eventId, debts.map(presentDebtListItem))
    emitFinalTableListUpdated(eventId, finalTable.map(presentFinalTableListItem))
    emitPaymentListUpdated(eventId, payments.map(presentPaymentListItem))
    emitPromotionListUpdated(eventId, promotions.map(presentPromotionListItem))
    emitTournamentListUpdated(eventId, tournament.map(presentTournamentListItem))
  }

  private uniqueByExternalId(participants: ExternalParticipant[]) {
    return Array.from(
      new Map(participants.map(participant => [participant.id, participant])).values(),
    )
  }

  private async findOrCreateEvent(
    externalEvent: Parameters<typeof mapExternalEventToCreateInput>[0],
  ) {
    const event = await this.eventsRepository.findByExternalId(externalEvent.id)
    const createInput = mapExternalEventToCreateInput(externalEvent)
    if (event) {
      await this.eventsRepository.updateFromExternalEvents([createInput])
      return {
        ...event,
        initialDepositAmount: createInput.initialDepositAmount ?? 0,
      }
    }

    return this.eventsRepository.create(createInput as Prisma.EventCreateInput)
  }
}
