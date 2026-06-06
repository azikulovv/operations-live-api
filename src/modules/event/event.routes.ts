import { Router } from 'express'
import { EventController } from './event.controller'
import { validate } from '@/common/middlewares/validate.middleware'
import { eventParticipantsQuerySchema } from './event.schemas'

export const eventRoutes = Router()

const controller = new EventController()

eventRoutes.get('/active', controller.getActiveEvents)
eventRoutes.get(
  '/participants',
  validate({ query: eventParticipantsQuerySchema }),
  controller.getEventParticipants,
)
