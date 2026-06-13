import type { Prisma } from '@prisma/client'

import { isExternalApiError } from '@/api/api.client'
import { notFound } from '@/common/errors/app-error'
import { prisma } from '@/database/prisma'
import { mapExternalEventToCreateInput } from '@/modules/events/events.mapper'
import { EventsRepository } from '@/modules/events/events.repository'
import { fetchEventParticipants } from '@/modules/participants/participants.external-client'
import { mapExternalParticipantToCreateInput } from '@/modules/participants/participants.mapper'
import { ParticipantsRepository } from '@/modules/participants/participants.repository'
import {
  emitParticipantListUpdated,
  emitParticipantUpdated,
} from '@/modules/participants/participants.realtime'
import type { UpdateParticipantDto } from '@/modules/participants/participants.schemas'
import type { ExternalParticipant } from '@/modules/participants/participants.types'

export class ParticipantsService {
  private readonly eventsRepository = new EventsRepository(prisma)
  private readonly participantsRepository = new ParticipantsRepository(prisma)

  async getEventParticipants(externalEventId: string) {
    try {
      const event = await this.syncEventParticipants(externalEventId)
      return this.participantsRepository.findByEventId(event.id)
    } catch (error) {
      if (!isExternalApiError(error) || error.statusCode !== 404) {
        throw error
      }

      const event = await this.eventsRepository.findByExternalId(externalEventId)
      if (!event) {
        throw notFound('Событие не найдено')
      }

      return this.participantsRepository.findByEventId(event.id)
    }
  }

  async syncEventParticipants(externalEventId: string) {
    const response = await fetchEventParticipants(externalEventId)
    const event = await this.findOrCreateEvent(response.event)
    const externalParticipants = this.uniqueByExternalId(response.participants)
    const existingExternalIds = await this.participantsRepository.findExternalIds(
      externalParticipants.map(participant => participant.id),
    )

    const participantsToCreate = externalParticipants
      .filter(participant => !existingExternalIds.has(participant.id))
      .map(participant => mapExternalParticipantToCreateInput(participant, event.id))

    const result = await this.participantsRepository.createMany(participantsToCreate)

    return {
      id: event.id,
      created: result.count,
      skipped: externalParticipants.length - result.count,
    }
  }

  async updateParticipant(participantId: string, dto: UpdateParticipantDto) {
    const participant = await this.participantsRepository.updateByParticipantId(
      participantId,
      dto,
    )
    const eventId = participant.event.externalId
    const list = await this.participantsRepository.findByEventId(participant.event.id)

    emitParticipantUpdated({
      eventId,
      participantId,
      participant,
    })

    emitParticipantListUpdated(eventId, list)

    return participant
  }

  private uniqueByExternalId(participants: ExternalParticipant[]) {
    return Array.from(
      new Map(participants.map(participant => [participant.id, participant])).values(),
    )
  }

  private async findOrCreateEvent(
    externalEvent: Parameters<typeof mapExternalEventToCreateInput>[0],
  ) {
    const event = await this.eventsRepository.findByExternalId(externalEvent.id)
    if (event) return event

    const createInput = mapExternalEventToCreateInput(externalEvent)
    return this.eventsRepository.create(createInput as Prisma.EventCreateInput)
  }
}
