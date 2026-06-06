import type { PrismaClient } from '@prisma/client'
import type { ExternalEventDto, Participant } from './event.types'
import {
  type EventParticipantWithPayment,
  mapExternalEventToCreateInput,
  mapExternalEventToUpdateInput,
  mapExternalParticipantToUpsertInput,
} from './event.mapper'

export class EventRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllOrderedByStart() {
    return this.prisma.event.findMany({
      orderBy: {
        startsAt: 'asc',
      },
    })
  }

  async findByExternalIdsOrdered(externalIds: string[]) {
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

  async findByIdOrExternalId(eventId: string) {
    return this.prisma.event.findFirst({
      where: {
        OR: [{ externalId: eventId }, { id: eventId }],
      },
      select: {
        id: true,
        externalId: true,
      },
    })
  }

  async upsertExternalEvents(events: ExternalEventDto[]) {
    await this.prisma.$transaction(
      events.map(event =>
        this.prisma.event.upsert({
          where: {
            externalId: event.id,
          },
          update: mapExternalEventToUpdateInput(event),
          create: mapExternalEventToCreateInput(event),
        }),
      ),
    )
  }

  async upsertExternalParticipants(eventId: string, participants: Participant[]) {
    await this.prisma.$transaction(
      participants.map(participant => {
        const data = mapExternalParticipantToUpsertInput(participant, eventId)

        return this.prisma.eventParticipant.upsert({
          where: {
            externalId: participant.id,
          },
          update: data,
          create: data,
        })
      }),
    )
  }

  async createMissingParticipantPayments(eventId: string) {
    const participantsWithoutPayment = await this.findParticipantsWithoutPayment(eventId)

    if (!participantsWithoutPayment.length) {
      return
    }

    await this.prisma.eventParticipantPayment.createMany({
      data: participantsWithoutPayment.map(participant => ({
        participantId: participant.id,
      })),
    })
  }

  async findParticipantsByEventId(eventId: string): Promise<EventParticipantWithPayment[]> {
    return this.prisma.eventParticipant.findMany({
      where: {
        eventId,
      },
      include: {
        payment: true,
      },
      orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { createdAt: 'asc' }],
    })
  }

  private async findParticipantsWithoutPayment(eventId: string) {
    return this.prisma.eventParticipant.findMany({
      where: {
        eventId,
        payment: null,
      },
      select: {
        id: true,
      },
    })
  }
}
