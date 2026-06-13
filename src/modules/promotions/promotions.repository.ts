import type { PrismaClient } from '@prisma/client'

import type { UpdatePromotionDto } from '@/modules/promotions/promotions.schemas'

export class PromotionsRepository {
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
        promotion: {
          select: {
            id: true,
            promotionType: true,
            reason: true,
            discountPercent: true,
            used: true,
            comment: true,
            updatedAt: true,
          },
        },
      },
      orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { userName: 'asc' }],
    })
  }

  async upsertByParticipantId(participantId: string, dto: UpdatePromotionDto) {
    return this.prisma.participantPromotion.upsert({
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
