import type { Request, Response } from 'express'

import type {
  EventIdParams,
  TableParams,
  UpdateTableDto,
} from '@/modules/tables/tables.schemas'
import { TablesService } from '@/modules/tables/tables.service'

const tablesService = new TablesService()

export class TablesController {
  async getEventTables(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await tablesService.getEventTables(params.eventId)
    res.json({ data })
  }

  async updateEventTable(req: Request, res: Response) {
    const params = req.validated?.params as TableParams
    const body = req.validated?.body as UpdateTableDto
    const data = await tablesService.updateEventTable(params.eventId, params.tableNumber, body)
    res.json({ data })
  }
}
