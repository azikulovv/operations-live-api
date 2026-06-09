import type { Request, Response } from 'express'

import type { EventIdParams } from '@/modules/shift-dashboard/shift-dashboard.schemas'
import { ShiftDashboardService } from '@/modules/shift-dashboard/shift-dashboard.service'

const shiftDashboardService = new ShiftDashboardService()

export class ShiftDashboardController {
  async getEventShiftDashboard(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await shiftDashboardService.getEventShiftDashboard(params.eventId)
    res.json({ data })
  }
}
