import type { Request, Response } from 'express'
import { EventService } from '@/modules/event/event.service'

const eventService = new EventService()

export class EventController {
  async getActiveEvents(_req: Request, res: Response) {
    const events = await eventService.getActiveEvents()
    res.json(events)
  }
}
