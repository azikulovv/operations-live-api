import { Router } from 'express'
import { EventController } from './event.controller'
import { validate } from '@/common/middlewares/validate.middleware'
import { eventPariticipantsSchema } from './event.schemas'

export const eventRoutes = Router()

const controller = new EventController()

eventRoutes.get('/active', controller.getActiveEvents)
eventRoutes.get(
  '/participants',
  validate({ query: eventPariticipantsSchema }),
  controller.getEventParticipants,
)
