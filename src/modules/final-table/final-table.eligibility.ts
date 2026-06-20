type FinalTableParticipantEligibility = {
  arrived: boolean
  badge: string | null
  status: string
}

export function isEligibleForFinalTable(participant: FinalTableParticipantEligibility) {
  return (
    participant.arrived &&
    Boolean(participant.badge?.trim()) &&
    participant.status.trim().toUpperCase() !== 'CANCELLED'
  )
}

export function isActiveTournamentParticipant(status: string | null | undefined) {
  return (status ?? 'ACTIVE').trim().toUpperCase() === 'ACTIVE'
}
