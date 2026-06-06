import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { PaymentsController } from '@/modules/payments/payments.controller'
import {
  eventIdParamsSchema,
  participantIdParamsSchema,
  updatePaymentSchema,
} from '@/modules/payments/payments.schemas'

export const eventPaymentsRoutes = Router({ mergeParams: true })
export const paymentsRoutes = Router()

const controller = new PaymentsController()

eventPaymentsRoutes.get('/', validate({ params: eventIdParamsSchema }), controller.getEventPayments)

paymentsRoutes.patch(
  '/:participantId',
  validate({
    params: participantIdParamsSchema,
    body: updatePaymentSchema,
  }),
  controller.updateParticipantPayment,
)
