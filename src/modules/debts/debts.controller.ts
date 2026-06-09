import type { Request, Response } from 'express'

import { DebtsService } from '@/modules/debts/debts.service'
import type {
  EventIdParams,
  ParticipantIdParams,
  UpdateDebtDto,
} from '@/modules/debts/debts.schemas'

const debtsService = new DebtsService()

export class DebtsController {
  async getEventDebts(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await debtsService.getEventDebts(params.eventId)
    res.json({ data })
  }

  async updateParticipantDebt(req: Request, res: Response) {
    const params = req.validated?.params as ParticipantIdParams
    const body = req.validated?.body as UpdateDebtDto
    const data = await debtsService.updateParticipantDebt(params.participantId, body)
    res.json({ data })
  }
}
