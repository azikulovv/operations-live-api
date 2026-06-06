import { Router } from 'express'

import { EventsController } from '@/modules/events/events.controller'

export const eventsRoutes = Router()

const controller = new EventsController()

eventsRoutes.get('/', controller.getEvents)
eventsRoutes.post('/sync', controller.syncActiveEvents)
