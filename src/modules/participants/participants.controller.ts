import type { Request, Response } from 'express'

import { ParticipantsService } from '@/modules/participants/participants.service'

const participantsService = new ParticipantsService()

export class ParticipantsController {
  async getEventParticipants(req: Request, res: Response) {
    const participants = await participantsService.getEventParticipants(getEventIdParam(req))
    res.json({
      data: participants,
    })
  }

  async syncEventParticipants(req: Request, res: Response) {
    const result = await participantsService.syncEventParticipants(getEventIdParam(req))
    res.json(result)
  }
}

function getEventIdParam(req: Request) {
  const eventId = req.params.eventId
  return Array.isArray(eventId) ? eventId[0] : eventId
}
