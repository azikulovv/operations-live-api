import type { PrismaClient } from '@prisma/client'
import { notFound } from '@/common/errors/app-error'
import { EventRepository } from './event.repository'
import { EventExternalClient } from './event.external-client'
import { mapEventParticipantToParticipant } from './event.mapper'

export class EventService {
  private readonly eventRepository: EventRepository
  private readonly eventExternalClient = new EventExternalClient()

  constructor(private readonly prisma: PrismaClient) {
    this.eventRepository = new EventRepository(prisma)
  }

  async getActiveEvents() {
    const externalEvents = await this.eventExternalClient.findActiveEvents()

    if (!externalEvents.length) {
      return this.eventRepository.findAllOrderedByStart()
    }

    await this.eventRepository.upsertExternalEvents(externalEvents)

    const externalIds = externalEvents.map(event => event.id)

    return this.eventRepository.findByExternalIdsOrdered(externalIds)
  }

  async getEventParticipants(eventId: string) {
    const event = await this.eventRepository.findByIdOrExternalId(eventId)

    if (!event?.externalId) {
      throw notFound('Событие не найдено')
    }

    const externalEventId = event.externalId
    const externalParticipants = await this.eventExternalClient.findParticipants(externalEventId)

    if (externalParticipants.length) {
      await this.eventRepository.upsertExternalParticipants(event.id, externalParticipants)
    }

    await this.eventRepository.createMissingParticipantPayments(event.id)

    const participants = await this.eventRepository.findParticipantsByEventId(event.id)

    return {
      data: participants.map(participant =>
        mapEventParticipantToParticipant(participant, externalEventId),
      ),
    }
  }
}
