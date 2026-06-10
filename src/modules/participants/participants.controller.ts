import type { Request, Response } from 'express'

import type {
  EventIdParams,
  UpdateParticipantDto,
  UpdateParticipantParams,
} from '@/modules/participants/participants.schemas'
import { ParticipantsService } from '@/modules/participants/participants.service'

const participantsService = new ParticipantsService()

export class ParticipantsController {
  async getEventParticipants(req: Request, res: Response) {
    const params = req.validated?.params as EventIdParams | undefined
    const participants = await participantsService.getEventParticipants(
      params?.eventId ?? getEventIdParam(req),
    )
    res.json({
      data: participants,
    })
  }

  async syncEventParticipants(req: Request, res: Response) {
    const result = await participantsService.syncEventParticipants(getEventIdParam(req))
    res.json(result)
  }

  async updateParticipant(req: Request, res: Response) {
    const params = req.validated?.params as UpdateParticipantParams
    const body = req.validated?.body as UpdateParticipantDto
    const data = await participantsService.updateParticipant(params.participantId, body)
    res.json({ data })
  }
}

function getEventIdParam(req: Request) {
  const eventId = req.params.eventId
  return Array.isArray(eventId) ? eventId[0] : eventId
}
