import { prisma } from '@/database/prisma'
import { ParticipantsService } from '@/modules/participants/participants.service'
import { presentBartenderSaleListItem } from '@/modules/bartender-sales/bartender-sales.presenter'
import {
  emitBartenderSaleListUpdated,
  emitBartenderSaleUpdated,
} from '@/modules/bartender-sales/bartender-sales.realtime'
import { BartenderSalesRepository } from '@/modules/bartender-sales/bartender-sales.repository'
import type { UpdateBartenderSaleDto } from '@/modules/bartender-sales/bartender-sales.schemas'

export class BartenderSalesService {
  private readonly participantsService = new ParticipantsService()
  private readonly bartenderSalesRepository = new BartenderSalesRepository(prisma)

  async getEventBartenderSales(externalEventId: string) {
    await this.participantsService.syncEventParticipantsIfAvailable(externalEventId)
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantBartenderSale(participantId: string, dto: UpdateBartenderSaleDto) {
    await this.participantsService.ensureParticipantCanBeEdited(participantId)

    const bartenderSale = await this.bartenderSalesRepository.upsertByParticipantId(
      participantId,
      dto,
    )
    const eventId = bartenderSale.participant.event.externalId
    const list = await this.findPresentedList(eventId)

    emitBartenderSaleUpdated({
      eventId,
      participantId,
      bartenderSale,
    })

    emitBartenderSaleListUpdated(eventId, list)

    return bartenderSale
  }

  private async findPresentedList(externalEventId: string) {
    const participants =
      await this.bartenderSalesRepository.findListByExternalEventId(externalEventId)
    return participants.map(presentBartenderSaleListItem)
  }
}
