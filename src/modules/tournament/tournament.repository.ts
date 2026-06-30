import type { PrismaClient } from '@prisma/client'

import type { UpdateTournamentDto } from '@/modules/tournament/tournament.schemas'

const BUSTOUT_STATUSES = new Set(['FINISHED'])

function isBustoutStatus(status: string | undefined) {
  return Boolean(status && BUSTOUT_STATUSES.has(status.trim().toUpperCase()))
}

export class TournamentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findListByExternalEventId(externalEventId: string) {
    return this.prisma.eventParticipant.findMany({
      where: {
        arrived: true,
        AND: [{ badge: { not: null } }, { badge: { not: '' } }],
        status: {
          not: 'CANCELLED',
        },
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
    return this.prisma.$transaction(async transaction => {
      const participant = await transaction.eventParticipant.findUnique({
        where: {
          id: participantId,
        },
        select: {
          eventId: true,
          tournament: {
            select: {
              bustoutOrder: true,
            },
          },
        },
      })

      if (!participant) {
        throw new Error('Участник не найден')
      }

      const data: UpdateTournamentDto = { ...dto }
      const currentBustoutOrder = participant.tournament?.bustoutOrder ?? 0
      const incomingBustoutOrder = data.bustoutOrder ?? 0

      if (isBustoutStatus(data.status) && currentBustoutOrder === 0 && incomingBustoutOrder === 0) {
        const latestBustout = await transaction.participantTournament.aggregate({
          where: {
            participant: {
              eventId: participant.eventId,
            },
          },
          _max: {
            bustoutOrder: true,
          },
        })

        data.bustoutOrder = (latestBustout._max.bustoutOrder ?? 0) + 1
      }

      return transaction.participantTournament.upsert({
        where: {
          participantId,
        },
        create: {
          participantId,
          ...data,
        },
        update: data,
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
    })
  }
}
