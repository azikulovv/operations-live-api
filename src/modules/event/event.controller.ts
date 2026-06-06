import type { Request, Response } from 'express'
import { EventService } from '@/modules/event/event.service'
import { EventParticipantsQuery } from './event.schemas'

const eventService = new EventService()

export class EventController {
  async getActiveEvents(_req: Request, res: Response) {
    const events = await eventService.getActiveEvents()
    res.json(events)
  }

  async getEventParticipants(req: Request, res: Response) {
    const query = req.validated?.query as EventParticipantsQuery
    const events = await eventService.getEventParticipants(query.eventId)
    res.json(events)
  }
}
