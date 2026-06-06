import { PrismaClient } from '@prisma/client'
import { EventRepository } from './event.repository'

export class EventService {
  private readonly eventRepository: EventRepository

  constructor(private readonly prisma: PrismaClient) {
    this.eventRepository = new EventRepository(prisma)
  }

  async getActiveEvents() {
    return this.eventRepository.findMany()
  }

  async getEventParticipants(eventId: string) {
    return this.eventRepository.findParticipants(eventId)
  }
}
