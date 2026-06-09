import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { DebtsController } from '@/modules/debts/debts.controller'
import {
  eventIdParamsSchema,
  participantIdParamsSchema,
  updateDebtSchema,
} from '@/modules/debts/debts.schemas'

export const eventDebtsRoutes = Router({ mergeParams: true })
export const debtsRoutes = Router()

const controller = new DebtsController()

eventDebtsRoutes.get('/', validate({ params: eventIdParamsSchema }), controller.getEventDebts)

debtsRoutes.patch(
  '/:participantId',
  validate({
    params: participantIdParamsSchema,
    body: updateDebtSchema,
  }),
  controller.updateParticipantDebt,
)
