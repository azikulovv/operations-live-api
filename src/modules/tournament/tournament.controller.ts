import type { Request, Response } from 'express'

import type {
  EventIdParams,
  ParticipantIdParams,
  UpdateTournamentDto,
} from '@/modules/tournament/tournament.schemas'
import { TournamentService } from '@/modules/tournament/tournament.service'

const tournamentService = new TournamentService()

export class TournamentController {
  async getEventTournament(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams
    const data = await tournamentService.getEventTournament(params.eventId)
    res.json({ data })
  }

  async updateParticipantTournament(req: Request, res: Response) {
    const params = req.validated?.params as ParticipantIdParams
    const body = req.validated?.body as UpdateTournamentDto
    const data = await tournamentService.updateParticipantTournament(params.participantId, body)
    res.json({ data })
  }
}
