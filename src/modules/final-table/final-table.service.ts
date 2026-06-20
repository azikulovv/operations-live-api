import { Prisma } from '@prisma/client'

import { badRequest, conflict } from '@/common/errors/app-error'
import { prisma } from '@/database/prisma'
import { isEligibleForFinalTable } from '@/modules/final-table/final-table.eligibility'
import { presentFinalTableListItem } from '@/modules/final-table/final-table.presenter'
import { FinalTableRepository } from '@/modules/final-table/final-table.repository'
import {
  emitFinalTableListUpdated,
  emitFinalTableUpdated,
} from '@/modules/final-table/final-table.realtime'
import type { UpdateFinalTableDto } from '@/modules/final-table/final-table.schemas'
import { ParticipantsService } from '@/modules/participants/participants.service'

export class FinalTableService {
  private readonly finalTableRepository = new FinalTableRepository(prisma)
  private readonly participantsService = new ParticipantsService()

  async getEventFinalTable(externalEventId: string) {
    await this.participantsService.syncEventParticipantsIfAvailable(externalEventId)
    await this.finalTableRepository.reconcileAutomaticFinalTable(externalEventId)
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantFinalTable(participantId: string, dto: UpdateFinalTableDto) {
    const participant = await this.finalTableRepository.findParticipantById(participantId)

    if (!participant) {
      throw badRequest('Участник не найден')
    }

    if (!isEligibleForFinalTable(participant)) {
      throw badRequest(
        'Для финального стола участник должен прибыть, иметь badge и не быть отмененным',
      )
    }

    const eventId = participant.event.externalId
    const { remainingCount } = await this.finalTableRepository.reconcileAutomaticFinalTable(eventId)

    if (remainingCount > 9) {
      throw badRequest('Финальный стол создается, когда в турнире остается не более 9 участников')
    }

    let finalTable
    try {
      finalTable = await this.finalTableRepository.upsertByParticipantId(
        participantId,
        participant.eventId,
        dto,
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw conflict(`Место ${dto.seat} за финальным столом уже занято`)
      }
      throw error
    }

    const list = await this.findPresentedList(eventId)

    emitFinalTableUpdated({
      eventId,
      participantId,
      finalTable,
    })

    emitFinalTableListUpdated(eventId, list)

    return finalTable
  }

  private async findPresentedList(externalEventId: string) {
    const finalTable = await this.finalTableRepository.findListByExternalEventId(externalEventId)
    return finalTable.map(presentFinalTableListItem)
  }
}
