import { externalApiRequest } from '@/external/external-api.client'
import {
  GetExternalEventResponse,
  GetExternalEventParticipantsDto,
  Participant,
} from './event.types'
import { PrismaClient } from '@prisma/client'
import { mapExternalEventToCreateInput } from './event.mapper'

export class EventRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany() {
    const response = await externalApiRequest<GetExternalEventResponse>('/events/active-now', {
      method: 'GET',
    })

    const externalEvents = response.data

    if (!externalEvents?.length) {
      return this.prisma.event.findMany({
        orderBy: {
          startsAt: 'asc',
        },
      })
    }

    const externalIds = externalEvents.map(event => event.id)

    const existingEvents = await this.prisma.event.findMany({
      where: {
        externalId: {
          in: externalIds,
        },
      },
      select: {
        externalId: true,
      },
    })

    const existingExternalIds = new Set(
      existingEvents.map(event => event.externalId).filter(Boolean),
    )

    const missingEvents = externalEvents.filter(event => !existingExternalIds.has(event.id))

    if (missingEvents.length) {
      await this.prisma.event.createMany({
        data: missingEvents.map(event => mapExternalEventToCreateInput(event)),
      })
    }

    return this.prisma.event.findMany({
      where: {
        externalId: {
          in: externalIds,
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    })
  }

  async findParticipants(eventId: string): Promise<{ data: Participant[] }> {
    const response = await externalApiRequest<GetExternalEventParticipantsDto>(
      `/events/${eventId}/participants`,
      {
        method: 'GET',
      },
    )
    return { data: response.participants }
  }
}
