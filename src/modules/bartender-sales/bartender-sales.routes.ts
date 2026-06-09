import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { BartenderSalesController } from '@/modules/bartender-sales/bartender-sales.controller'
import {
  eventIdParamsSchema,
  participantIdParamsSchema,
  updateBartenderSaleSchema,
} from '@/modules/bartender-sales/bartender-sales.schemas'

export const eventBartenderSalesRoutes = Router({ mergeParams: true })
export const bartenderSalesRoutes = Router()

const controller = new BartenderSalesController()

eventBartenderSalesRoutes.get(
  '/',
  validate({ params: eventIdParamsSchema }),
  controller.getEventBartenderSales,
)

bartenderSalesRoutes.patch(
  '/:participantId',
  validate({
    params: participantIdParamsSchema,
    body: updateBartenderSaleSchema,
  }),
  controller.updateParticipantBartenderSale,
)
