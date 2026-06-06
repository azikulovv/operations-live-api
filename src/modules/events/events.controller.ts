import type { Request, Response } from 'express'

import { EventsService } from '@/modules/events/events.service'

const eventsService = new EventsService()

export class EventsController {
  async getEvents(_req: Request, res: Response) {
    const events = await eventsService.getEvents()
    res.json({
      data: events,
    })
  }

  async syncActiveEvents(_req: Request, res: Response) {
    const result = await eventsService.syncActiveEvents()
    res.json(result)
  }
}
