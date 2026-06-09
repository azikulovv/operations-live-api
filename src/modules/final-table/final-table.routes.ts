import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { FinalTableController } from '@/modules/final-table/final-table.controller'
import {
  eventIdParamsSchema,
  participantIdParamsSchema,
  updateFinalTableSchema,
} from '@/modules/final-table/final-table.schemas'

export const eventFinalTableRoutes = Router({ mergeParams: true })
export const finalTableRoutes = Router()

const controller = new FinalTableController()

eventFinalTableRoutes.get(
  '/',
  validate({ params: eventIdParamsSchema }),
  controller.getEventFinalTable,
)

finalTableRoutes.patch(
  '/:participantId',
  validate({
    params: participantIdParamsSchema,
    body: updateFinalTableSchema,
  }),
  controller.updateParticipantFinalTable,
)
