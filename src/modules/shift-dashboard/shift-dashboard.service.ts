import { prisma } from '@/database/prisma'
import { ParticipantsService } from '@/modules/participants/participants.service'
import { presentShiftDashboard } from '@/modules/shift-dashboard/shift-dashboard.presenter'
import { ShiftDashboardRepository } from '@/modules/shift-dashboard/shift-dashboard.repository'

export class ShiftDashboardService {
  private readonly participantsService = new ParticipantsService()
  private readonly shiftDashboardRepository = new ShiftDashboardRepository(prisma)

  async getEventShiftDashboard(externalEventId: string) {
    await this.participantsService.syncEventParticipants(externalEventId)

    const participants =
      await this.shiftDashboardRepository.findParticipantsByExternalEventId(externalEventId)

    const totals = participants.reduce(
      (acc, participant) => {
        const tournamentAccrual = Math.max(
          (participant.payment?.accruedAmount ?? 0) -
            (participant.payment?.discountAmount ?? 0),
          0,
        )
        const barAccrual = participant.bartenderSale?.amount ?? 0
        const dartsBilliardsAccrual = 0
        const participantTotalAccrued = tournamentAccrual + barAccrual + dartsBilliardsAccrual
        const paidAmount = participant.payment?.paidAmount ?? 0
        const currentDebt = Math.max(participantTotalAccrued - paidAmount, 0)
        const isInTournament = participant.tableNumber !== null || participant.seatNumber !== null

        acc.playersInList += 1
        acc.playersInTournament += isInTournament ? 1 : 0
        acc.tournamentAccruals += tournamentAccrual
        acc.barAccruals += barAccrual
        acc.dartsBilliardsAccruals += dartsBilliardsAccrual
        acc.totalAccrued += participantTotalAccrued
        acc.paidAmount += paidAmount
        acc.currentDebt += currentDebt
        acc.playersWithDebt += currentDebt > 0 ? 1 : 0

        return acc
      },
      {
        playersInList: 0,
        playersInTournament: 0,
        tournamentAccruals: 0,
        barAccruals: 0,
        dartsBilliardsAccruals: 0,
        totalAccrued: 0,
        paidAmount: 0,
        currentDebt: 0,
        playersWithDebt: 0,
      },
    )

    return presentShiftDashboard(totals)
  }
}
