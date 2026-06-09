import type { Request, Response } from 'express'

import { BartenderSalesService } from '@/modules/bartender-sales/bartender-sales.service'
import type {
  EventIdParams,
  ParticipantIdParams,
  UpdateBartenderSaleDto,
} from '@/modules/bartender-sales/bartender-sales.schemas'

const bartenderSalesService = new BartenderSalesService()

export class BartenderSalesController {
  async getEventBartenderSales(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await bartenderSalesService.getEventBartenderSales(params.eventId)
    res.json({ data })
  }

  async updateParticipantBartenderSale(req: Request, res: Response) {
    const params = req.validated?.params as ParticipantIdParams
    const body = req.validated?.body as UpdateBartenderSaleDto
    const data = await bartenderSalesService.updateParticipantBartenderSale(
      params.participantId,
      body,
    )
    res.json({ data })
  }
}
