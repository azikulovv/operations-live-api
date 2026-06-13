import type { PrismaClient } from '@prisma/client'

import type { UpdatePaymentDto } from '@/modules/payments/payments.schemas'

export class PaymentsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findListByExternalEventId(externalEventId: string) {
    return this.prisma.eventParticipant.findMany({
      where: {
        arrived: true,
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
        payment: {
          select: {
            id: true,
            accruedAmount: true,
            discountAmount: true,
            paidAmount: true,
            status: true,
            comment: true,
            updatedAt: true,
          },
        },
        promotion: {
          select: {
            id: true,
            participantId: true,
            promotionType: true,
            reason: true,
            discountPercent: true,
            used: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { userName: 'asc' }],
    })
  }

  async upsertByParticipantId(participantId: string, dto: UpdatePaymentDto) {
    return this.prisma.participantPayment.upsert({
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
