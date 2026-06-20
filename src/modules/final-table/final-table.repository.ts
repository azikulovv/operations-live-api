import type { PrismaClient } from '@prisma/client'

import type { UpdateFinalTableDto } from '@/modules/final-table/final-table.schemas'
import {
  isActiveTournamentParticipant,
  isEligibleForFinalTable,
} from '@/modules/final-table/final-table.eligibility'

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
        status: true,
        arrived: true,
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
    const finalTable = await this.prisma.participantFinalTable.findMany({
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
            userEmail: true,
            badge: true,
            arrived: true,
            status: true,
          },
        },
      },
      orderBy: {
        seat: 'asc',
      },
    })

    return finalTable.filter(item => isEligibleForFinalTable(item.participant))
  }

  async deleteByParticipantId(participantId: string) {
    return this.prisma.participantFinalTable.deleteMany({
      where: {
        participantId,
      },
    })
  }

  async deleteIneligibleByExternalEventId(externalEventId: string) {
    const finalTable = await this.prisma.participantFinalTable.findMany({
      where: {
        event: {
          externalId: externalEventId,
        },
      },
      select: {
        id: true,
        participant: {
          select: {
            arrived: true,
            badge: true,
            status: true,
          },
        },
      },
    })
    const ids = finalTable
      .filter(item => !isEligibleForFinalTable(item.participant))
      .map(item => item.id)

    if (ids.length === 0) return { count: 0 }

    return this.prisma.participantFinalTable.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  async reconcileAutomaticFinalTable(externalEventId: string) {
    return this.prisma.$transaction(async transaction => {
      const event = await transaction.event.findUnique({
        where: {
          externalId: externalEventId,
        },
        select: {
          id: true,
          participants: {
            select: {
              id: true,
              arrived: true,
              badge: true,
              status: true,
              seatNumber: true,
              tournament: {
                select: {
                  status: true,
                },
              },
            },
            orderBy: [{ tableNumber: 'asc' }, { seatNumber: 'asc' }, { registeredAt: 'asc' }],
          },
        },
      })

      if (!event) return { remainingCount: 0, created: 0 }

      const remainingParticipants = event.participants.filter(
        participant =>
          isEligibleForFinalTable(participant) &&
          isActiveTournamentParticipant(participant.tournament?.status),
      )
      const remainingIds = remainingParticipants.map(participant => participant.id)

      await transaction.participantFinalTable.deleteMany({
        where: {
          eventId: event.id,
          ...(remainingParticipants.length <= 9 && remainingParticipants.length > 0
            ? { participantId: { notIn: remainingIds } }
            : {}),
        },
      })

      if (remainingParticipants.length === 0 || remainingParticipants.length > 9) {
        return { remainingCount: remainingParticipants.length, created: 0 }
      }

      const existing = await transaction.participantFinalTable.findMany({
        where: {
          eventId: event.id,
        },
        select: {
          participantId: true,
          seat: true,
        },
      })
      const existingParticipantIds = new Set(existing.map(item => item.participantId))
      const occupiedSeats = new Set(existing.map(item => item.seat))
      const recordsToCreate = remainingParticipants
        .filter(participant => !existingParticipantIds.has(participant.id))
        .map(participant => {
          const preferredSeat = participant.seatNumber
          const seat =
            preferredSeat &&
            preferredSeat >= 1 &&
            preferredSeat <= 9 &&
            !occupiedSeats.has(preferredSeat)
              ? preferredSeat
              : Array.from({ length: 9 }, (_, index) => index + 1).find(
                  candidate => !occupiedSeats.has(candidate),
                )

          if (!seat) {
            throw new Error('Не удалось определить свободное место за финальным столом')
          }

          occupiedSeats.add(seat)
          return {
            eventId: event.id,
            participantId: participant.id,
            seat,
            stack: 0,
          }
        })

      if (recordsToCreate.length > 0) {
        await transaction.participantFinalTable.createMany({
          data: recordsToCreate,
        })
      }

      return {
        remainingCount: remainingParticipants.length,
        created: recordsToCreate.length,
      }
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
