import type { Request, Response } from 'express'

import { PromotionsService } from '@/modules/promotions/promotions.service'
import type {
  EventIdParams,
  ParticipantIdParams,
  UpdatePromotionDto,
} from '@/modules/promotions/promotions.schemas'

const promotionsService = new PromotionsService()

export class PromotionsController {
  async getEventPromotions(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await promotionsService.getEventPromotions(params.eventId)
    res.json({ data })
  }

  async updateParticipantPromotion(req: Request, res: Response) {
    const params = req.validated?.params as ParticipantIdParams
    const body = req.validated?.body as UpdatePromotionDto
    const data = await promotionsService.updateParticipantPromotion(params.participantId, body)
    res.json({ data })
  }
}
