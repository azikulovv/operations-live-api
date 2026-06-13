import type { PrismaClient } from '@prisma/client'

import type { UpdateDebtDto } from '@/modules/debts/debts.schemas'

export class DebtsRepository {
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
        debt: {
          select: {
            id: true,
            amount: true,
            comment: true,
            closed: true,
            updatedAt: true,
          },
        },
      },
      orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { userName: 'asc' }],
    })
  }

  async upsertByParticipantId(participantId: string, dto: UpdateDebtDto) {
    return this.prisma.participantDebt.upsert({
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
