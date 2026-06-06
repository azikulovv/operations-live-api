import type { PrismaClient } from '@prisma/client'
import type { ExternalEventDto, Participant } from './event.types'
import type { UpdateEventParticipantDto } from './event.schemas'
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

  async updateParticipant(participantId: string, dto: UpdateEventParticipantDto) {
    return this.prisma.$transaction(async tx => {
      const participant = await tx.eventParticipant.findFirst({
        where: {
          OR: [{ id: participantId }, { externalId: participantId }],
        },
        select: {
          id: true,
        },
      })

      if (!participant) {
        return null
      }

      if (dto.userBadge !== undefined) {
        await tx.eventParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            userBadge: dto.userBadge,
          },
        })
      }

      if (dto.closed !== undefined) {
        await tx.eventParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            closed: dto.closed,
          },
        })
      }

      if (dto.payment !== undefined) {
        await tx.eventParticipantPayment.upsert({
          where: {
            participantId: participant.id,
          },
          update: dto.payment,
          create: {
            participantId: participant.id,
            ...dto.payment,
          },
        })
      }

      return tx.eventParticipant.findUnique({
        where: {
          id: participant.id,
        },
        include: {
          payment: true,
          event: {
            select: {
              id: true,
              externalId: true,
            },
          },
        },
      })
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
