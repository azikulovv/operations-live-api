import { prisma } from '@/database/prisma'
import { fetchActiveEvents, fetchUpcomingEvents } from '@/modules/events/events.external-client'
import { mapExternalEventToCreateInput } from '@/modules/events/events.mapper'
import { EventsRepository } from '@/modules/events/events.repository'
import type { ActiveEventsResponse, ExternalEvent } from '@/modules/events/events.types'

export class EventsService {
  private readonly eventsRepository = new EventsRepository(prisma)

  async getEvents() {
    await this.syncActiveEvents()
    return this.eventsRepository.findAll()
  }

  async syncActiveEvents() {
    return this.syncEvents(fetchActiveEvents)
  }

  async getUpcomingEvents() {
    await this.syncUpcomingEvents()
    return this.eventsRepository.findUpcoming(new Date())
  }

  async syncUpcomingEvents() {
    return this.syncEvents(fetchUpcomingEvents)
  }

  private async syncEvents(fetchEvents: () => Promise<ActiveEventsResponse>) {
    const response = await fetchEvents()
    const externalEvents = this.uniqueByExternalId(response.data)
    const existingExternalIds = await this.eventsRepository.findExternalIds(
      externalEvents.map(event => event.id),
    )

    const eventsToCreate = externalEvents
      .filter(event => !existingExternalIds.has(event.id))
      .map(mapExternalEventToCreateInput)

    const result = await this.eventsRepository.createMany(eventsToCreate)

    return {
      created: result.count,
      skipped: externalEvents.length - result.count,
    }
  }

  private uniqueByExternalId(events: ExternalEvent[]) {
    return Array.from(new Map(events.map(event => [event.id, event])).values())
  }
}
