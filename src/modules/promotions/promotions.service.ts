import { prisma } from '@/database/prisma'
import { ParticipantsService } from '@/modules/participants/participants.service'
import { presentPromotionListItem } from '@/modules/promotions/promotions.presenter'
import {
  emitPromotionListUpdated,
  emitPromotionUpdated,
} from '@/modules/promotions/promotions.realtime'
import { PromotionsRepository } from '@/modules/promotions/promotions.repository'
import type { UpdatePromotionDto } from '@/modules/promotions/promotions.schemas'

export class PromotionsService {
  private readonly participantsService = new ParticipantsService()
  private readonly promotionsRepository = new PromotionsRepository(prisma)

  async getEventPromotions(externalEventId: string) {
    await this.participantsService.syncEventParticipantsIfAvailable(externalEventId)
    return this.findPresentedList(externalEventId)
  }

  async updateParticipantPromotion(participantId: string, dto: UpdatePromotionDto) {
    const promotion = await this.promotionsRepository.upsertByParticipantId(participantId, dto)
    const eventId = promotion.participant.event.externalId
    const list = await this.findPresentedList(eventId)

    emitPromotionUpdated({
      eventId,
      participantId,
      promotion,
    })

    emitPromotionListUpdated(eventId, list)

    return promotion
  }

  private async findPresentedList(externalEventId: string) {
    const participants = await this.promotionsRepository.findListByExternalEventId(externalEventId)
    return participants.map(presentPromotionListItem)
  }
}
