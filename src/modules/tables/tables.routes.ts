import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { TablesController } from '@/modules/tables/tables.controller'
import {
  eventIdParamsSchema,
  tableParamsSchema,
  updateTableSchema,
} from '@/modules/tables/tables.schemas'

export const eventTablesRoutes = Router({ mergeParams: true })

const controller = new TablesController()

eventTablesRoutes.get('/', validate({ params: eventIdParamsSchema }), controller.getEventTables)

eventTablesRoutes.patch(
  '/:tableNumber',
  validate({
    params: tableParamsSchema,
    body: updateTableSchema,
  }),
  controller.updateEventTable,
)
