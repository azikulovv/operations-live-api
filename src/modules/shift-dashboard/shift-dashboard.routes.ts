import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { ShiftDashboardController } from '@/modules/shift-dashboard/shift-dashboard.controller'
import { eventIdParamsSchema } from '@/modules/shift-dashboard/shift-dashboard.schemas'

export const eventShiftDashboardRoutes = Router({ mergeParams: true })

const controller = new ShiftDashboardController()

eventShiftDashboardRoutes.get(
  '/',
  validate({ params: eventIdParamsSchema }),
  controller.getEventShiftDashboard,
)
