import { Router } from 'express'

import { EventsController } from '@/modules/events/events.controller'

export const eventsRoutes = Router()

const controller = new EventsController()

eventsRoutes.get('/upcoming', controller.getUpcomingEvents)
eventsRoutes.post('/upcoming/sync', controller.syncUpcomingEvents)
eventsRoutes.get('/', controller.getEvents)
eventsRoutes.post('/sync', controller.syncActiveEvents)
