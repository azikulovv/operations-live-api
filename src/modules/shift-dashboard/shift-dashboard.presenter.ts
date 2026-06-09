type DashboardTotals = {
  playersInList: number
  playersInTournament: number
  tournamentAccruals: number
  barAccruals: number
  dartsBilliardsAccruals: number
  totalAccrued: number
  paidAmount: number
  currentDebt: number
  playersWithDebt: number
}

export function presentShiftDashboard(totals: DashboardTotals) {
  return {
    playersInList: totals.playersInList,
    playersInTournament: totals.playersInTournament,
    accruals: {
      tournament: totals.tournamentAccruals,
      bar: totals.barAccruals,
      dartsBilliards: totals.dartsBilliardsAccruals,
      total: totals.totalAccrued,
    },
    paidAmount: totals.paidAmount,
    currentDebt: totals.currentDebt,
    playersWithDebt: totals.playersWithDebt,
  }
}
