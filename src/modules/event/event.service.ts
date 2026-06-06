import { EventRepository } from './event.repository'

export class EventService {
  private readonly eventRepository = new EventRepository()

  async getActiveEvents() {
    return this.eventRepository.findActiveEvents()
  }
}
