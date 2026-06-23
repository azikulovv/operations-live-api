import type { PrismaClient } from '@prisma/client'

export class ShiftDashboardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findParticipantsByExternalEventId(externalEventId: string) {
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
        status: true,
        tableNumber: true,
        seatNumber: true,
        initialDepositAmount: true,
        payment: {
          select: {
            accruedAmount: true,
            discountAmount: true,
            paidAmount: true,
          },
        },
        promotion: {
          select: {
            promotionType: true,
            discountPercent: true,
          },
        },
        bartenderSale: {
          select: {
            amount: true,
          },
        },
      },
    })
  }
}
