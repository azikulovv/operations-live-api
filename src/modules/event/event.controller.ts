import type { Request, Response } from 'express'
import { EventService } from '@/modules/event/event.service'
import type { EventParticipantsQuery } from './event.schemas'
import { prisma } from '@/database/prisma'

const eventService = new EventService(prisma)

export class EventController {
  getActiveEvents = async (_req: Request, res: Response) => {
    const events = await eventService.getActiveEvents()
    res.json(events)
  }

  getEventParticipants = async (req: Request, res: Response) => {
    const query = req.validated?.query as EventParticipantsQuery
    const events = await eventService.getEventParticipants(query.eventId)
    res.json(events)
  }
}
