import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { ParticipantsController } from '@/modules/participants/participants.controller'
import {
  eventIdParamsSchema,
  updateParticipantParamsSchema,
  updateParticipantSchema,
} from '@/modules/participants/participants.schemas'

export const participantsRoutes = Router({ mergeParams: true })

const controller = new ParticipantsController()

participantsRoutes.get(
  '/',
  validate({ params: eventIdParamsSchema }),
  controller.getEventParticipants,
)
participantsRoutes.post('/sync', controller.syncEventParticipants)
participantsRoutes.patch(
  '/:participantId',
  validate({
    params: updateParticipantParamsSchema,
    body: updateParticipantSchema,
  }),
  controller.updateParticipant,
)
