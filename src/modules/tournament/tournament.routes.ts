import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { TournamentController } from '@/modules/tournament/tournament.controller'
import {
  eventIdParamsSchema,
  participantIdParamsSchema,
  updateTournamentSchema,
} from '@/modules/tournament/tournament.schemas'

export const eventTournamentRoutes = Router({ mergeParams: true })
export const tournamentRoutes = Router()

const controller = new TournamentController()

eventTournamentRoutes.get(
  '/',
  validate({ params: eventIdParamsSchema }),
  controller.getEventTournament,
)

tournamentRoutes.patch(
  '/:participantId',
  validate({
    params: participantIdParamsSchema,
    body: updateTournamentSchema,
  }),
  controller.updateParticipantTournament,
)
