import { badRequest } from '@/common/errors/app-error'
import { prisma } from '@/database/prisma'
import { presentFinalTableListItem } from '@/modules/final-table/final-table.presenter'
import { FinalTableRepository } from '@/modules/final-table/final-table.repository'
import {
  emitFinalTableListUpdated,
  emitFinalTableUpdated,
} from '@/modules/final-table/final-table.realtime'
import type { UpdateFinalTableDto } from '@/modules/final-table/final-table.schemas'

export class FinalTableService {
  private readonly finalTableRepository = new FinalTableRepository(prisma)

  async getEventFinalTable(externalEventId: string) {
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantFinalTable(participantId: string, dto: UpdateFinalTableDto) {
    const participant = await this.finalTableRepository.findParticipantById(participantId)

    if (!participant) {
      throw badRequest('Участник не найден')
    }

    const finalTable = await this.finalTableRepository.upsertByParticipantId(
      participantId,
      participant.eventId,
      dto,
    )
    const eventId = participant.event.externalId
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
