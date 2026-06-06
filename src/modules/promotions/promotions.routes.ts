import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { PromotionsController } from '@/modules/promotions/promotions.controller'
import {
  eventIdParamsSchema,
  participantIdParamsSchema,
  updatePromotionSchema,
} from '@/modules/promotions/promotions.schemas'

export const eventPromotionsRoutes = Router({ mergeParams: true })
export const promotionsRoutes = Router()

const controller = new PromotionsController()

eventPromotionsRoutes.get(
  '/',
  validate({ params: eventIdParamsSchema }),
  controller.getEventPromotions,
)

promotionsRoutes.patch(
  '/:participantId',
  validate({
    params: participantIdParamsSchema,
    body: updatePromotionSchema,
  }),
  controller.updateParticipantPromotion,
)
