import type { Request, Response } from 'express'

import { PaymentsService } from '@/modules/payments/payments.service'
import type {
  EventIdParams,
  ParticipantIdParams,
  UpdatePaymentDto,
} from '@/modules/payments/payments.schemas'

const paymentsService = new PaymentsService()

export class PaymentsController {
  async getEventPayments(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await paymentsService.getEventPayments(params.eventId)
    res.json({ data })
  }

  async updateParticipantPayment(req: Request, res: Response) {
    const params = req.validated?.params as ParticipantIdParams
    const body = req.validated?.body as UpdatePaymentDto
    const data = await paymentsService.updateParticipantPayment(params.participantId, body)
    res.json({ data })
  }
}
