import type { PrismaClient } from '@prisma/client'

import type { UpdateTournamentDto } from '@/modules/tournament/tournament.schemas'

export class TournamentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findListByExternalEventId(externalEventId: string) {
    return this.prisma.eventParticipant.findMany({
      where: {
        event: {
          externalId: externalEventId,
        },
      },
      select: {
        id: true,
        externalId: true,
        externalUserId: true,
        status: true,
        tableNumber: true,
        seatNumber: true,
        position: true,
        userName: true,
        userEmail: true,
        userPhone: true,
        userTelegramId: true,
        userAvatarUrl: true,
        badge: true,
        tournament: {
          select: {
            id: true,
            reEntry: true,
            addon: true,
            knockouts: true,
            bustoutOrder: true,
            status: true,
            updatedAt: true,
          },
        },
      },
      orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { userName: 'asc' }],
    })
  }

  async upsertByParticipantId(participantId: string, dto: UpdateTournamentDto) {
    return this.prisma.participantTournament.upsert({
      where: {
        participantId,
      },
      create: {
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
                id: true,
                externalId: true,
              },
            },
          },
        },
      },
    })
  }
}
