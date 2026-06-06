import { Router } from 'express'
import { EventController } from './event.controller'
import { validate } from '@/common/middlewares/validate.middleware'
import {
  eventParticipantParamsSchema,
  eventParticipantsQuerySchema,
  updateEventParticipantSchema,
} from './event.schemas'

export const eventRoutes = Router()

const controller = new EventController()

eventRoutes.get('/active', controller.getActiveEvents)
eventRoutes.get(
  '/participants',
  validate({ query: eventParticipantsQuerySchema }),
  controller.getEventParticipants,
)
eventRoutes.patch(
  '/participants/:participantId',
  validate({
    params: eventParticipantParamsSchema,
    body: updateEventParticipantSchema,
  }),
  controller.updateEventParticipant,
)
