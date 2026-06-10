import type { Prisma, PrismaClient } from '@prisma/client'

import type { UpdateParticipantDto } from '@/modules/participants/participants.schemas'

export class ParticipantsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findExternalIds(externalIds: string[]) {
    if (externalIds.length === 0) return new Set<string>()

    const participants = await this.prisma.eventParticipant.findMany({
      where: {
        externalId: {
          in: externalIds,
        },
      },
      select: {
        externalId: true,
      },
    })

    return new Set(participants.map(participant => participant.externalId))
  }

  async createMany(participants: Prisma.EventParticipantCreateManyInput[]) {
    if (participants.length === 0) return { count: 0 }

    return this.prisma.eventParticipant.createMany({
      data: participants,
    })
  }

  async findByEventId(eventId: string) {
    return this.prisma.eventParticipant.findMany({
      where: {
        eventId,
      },
      include: {
        bartenderSale: true,
        promotion: true,
        debt: true,
        payment: true,
        tournament: true,
      },
      orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { registeredAt: 'asc' }],
    })
  }

  async updateByParticipantId(participantId: string, dto: UpdateParticipantDto) {
    return this.prisma.eventParticipant.update({
      where: {
        id: participantId,
      },
      data: dto,
      include: {
        event: {
          select: {
            id: true,
            externalId: true,
          },
        },
        bartenderSale: true,
        promotion: true,
        debt: true,
        payment: true,
        tournament: true,
      },
    })
  }
}
