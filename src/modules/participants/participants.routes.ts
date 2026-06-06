import { Router } from 'express'

import { ParticipantsController } from '@/modules/participants/participants.controller'

export const participantsRoutes = Router({ mergeParams: true })

const controller = new ParticipantsController()

participantsRoutes.get('/', controller.getEventParticipants)
participantsRoutes.post('/sync', controller.syncEventParticipants)
