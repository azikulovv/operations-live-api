import { EventRepository } from './event.repository'

export class EventService {
  private readonly eventRepository = new EventRepository()

  async getActiveEvents() {
    return this.eventRepository.findActiveEvents()
  }

  async getEventParticipants(eventId: string) {
    return this.eventRepository.findEventParticipants(eventId)
  }
}
