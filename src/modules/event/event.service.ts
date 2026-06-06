import type { PrismaClient } from '@prisma/client'
import { notFound } from '@/common/errors/app-error'
import { EventRepository } from './event.repository'
import { EventExternalClient } from './event.external-client'
import { mapEventParticipantToParticipant } from './event.mapper'
import { emitActiveEventsUpdated, emitEventParticipantsUpdated } from './event.realtime'
import type { UpdateEventParticipantDto } from './event.schemas'

export class EventService {
  private readonly eventRepository: EventRepository
  private readonly eventExternalClient = new EventExternalClient()

  constructor(private readonly prisma: PrismaClient) {
    this.eventRepository = new EventRepository(prisma)
  }

  async getActiveEvents() {
    const externalEvents = await this.eventExternalClient.findActiveEvents()

    if (!externalEvents.length) {
      const events = await this.eventRepository.findAllOrderedByStart()
      emitActiveEventsUpdated(events)

      return events
    }

    await this.eventRepository.upsertExternalEvents(externalEvents)

    const externalIds = externalEvents.map(event => event.id)

    const events = await this.eventRepository.findByExternalIdsOrdered(externalIds)
    emitActiveEventsUpdated(events)

    return events
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

    const response = {
      data: participants.map(participant =>
        mapEventParticipantToParticipant(participant, externalEventId),
      ),
    }

    emitEventParticipantsUpdated([event.id, externalEventId], response.data)

    return response
  }

  async updateEventParticipant(participantId: string, dto: UpdateEventParticipantDto) {
    const updatedParticipant = await this.eventRepository.updateParticipant(participantId, dto)

    if (!updatedParticipant) {
      throw notFound('Участник события не найден')
    }

    const externalEventId = updatedParticipant.event.externalId ?? updatedParticipant.event.id
    const participant = mapEventParticipantToParticipant(updatedParticipant, externalEventId)
    const participants = await this.eventRepository.findParticipantsByEventId(
      updatedParticipant.event.id,
    )
    const eventParticipants = participants.map(participant =>
      mapEventParticipantToParticipant(participant, externalEventId),
    )
    const eventRoomIds = [updatedParticipant.event.id]

    if (updatedParticipant.event.externalId) {
      eventRoomIds.push(updatedParticipant.event.externalId)
    }

    emitEventParticipantsUpdated(eventRoomIds, eventParticipants)

    return {
      data: participant,
    }
  }
}
