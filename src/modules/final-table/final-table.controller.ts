import type { Request, Response } from 'express'

import type {
  EventIdParams,
  ParticipantIdParams,
  UpdateFinalTableDto,
} from '@/modules/final-table/final-table.schemas'
import { FinalTableService } from '@/modules/final-table/final-table.service'

const finalTableService = new FinalTableService()

export class FinalTableController {
  async getEventFinalTable(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await finalTableService.getEventFinalTable(params.eventId)
    res.json({ data })
  }

  async updateParticipantFinalTable(req: Request, res: Response) {
    const params = req.validated?.params as ParticipantIdParams
    const body = req.validated?.body as UpdateFinalTableDto
    const data = await finalTableService.updateParticipantFinalTable(params.participantId, body)
    res.json({ data })
  }
}
