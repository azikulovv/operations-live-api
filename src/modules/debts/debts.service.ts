import { prisma } from '@/database/prisma'
import { DebtsRepository } from '@/modules/debts/debts.repository'
import { emitDebtListUpdated, emitDebtUpdated } from '@/modules/debts/debts.realtime'
import type { UpdateDebtDto } from '@/modules/debts/debts.schemas'
import { presentDebtListItem } from '@/modules/debts/debts.presenter'
import { ParticipantsService } from '@/modules/participants/participants.service'

export class DebtsService {
  private readonly participantsService = new ParticipantsService()
  private readonly debtsRepository = new DebtsRepository(prisma)

  async getEventDebts(externalEventId: string) {
    await this.participantsService.syncEventParticipants(externalEventId)
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantDebt(participantId: string, dto: UpdateDebtDto) {
    const debt = await this.debtsRepository.upsertByParticipantId(participantId, dto)
    const eventId = debt.participant.event.externalId
    const list = await this.findPresentedList(eventId)

    emitDebtUpdated({
      eventId,
      participantId,
      debt,
    })

    emitDebtListUpdated(eventId, list)

    return debt
  }

  private async findPresentedList(externalEventId: string) {
    const participants = await this.debtsRepository.findListByExternalEventId(externalEventId)
    return participants.map(presentDebtListItem)
  }
}
