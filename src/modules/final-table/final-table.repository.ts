import type { PrismaClient } from '@prisma/client'

import type { UpdateFinalTableDto } from '@/modules/final-table/final-table.schemas'

export class FinalTableRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findParticipantById(participantId: string) {
    return this.prisma.eventParticipant.findUnique({
      where: {
        id: participantId,
      },
      select: {
        id: true,
        eventId: true,
        externalId: true,
        externalUserId: true,
        userName: true,
        badge: true,
        event: {
          select: {
            externalId: true,
          },
        },
      },
    })
  }

  async findListByExternalEventId(externalEventId: string) {
    return this.prisma.participantFinalTable.findMany({
      where: {
        event: {
          externalId: externalEventId,
        },
      },
      include: {
        participant: {
          select: {
            id: true,
            externalId: true,
            externalUserId: true,
            userName: true,
            badge: true,
          },
        },
      },
      orderBy: {
        seat: 'asc',
      },
    })
  }

  async upsertByParticipantId(participantId: string, eventId: string, dto: UpdateFinalTableDto) {
    return this.prisma.participantFinalTable.upsert({
      where: {
        participantId,
      },
      create: {
        eventId,
        participantId,
        ...dto,
      },
      update: dto,
      include: {
        participant: {
          select: {
            id: true,
            externalId: true,
            externalUserId: true,
            userName: true,
            badge: true,
            event: {
              select: {
                externalId: true,
              },
            },
          },
        },
      },
    })
  }
}
