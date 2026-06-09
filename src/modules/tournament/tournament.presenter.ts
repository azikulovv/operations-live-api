type TournamentListItem = {
  id: string
  externalId: string
  externalUserId: string
  status: string
  tableNumber: number | null
  seatNumber: number | null
  position: number | null
  userName: string | null
  userEmail: string | null
  userPhone: string | null
  userTelegramId: string | null
  userAvatarUrl: string | null
  badge: string | null
  tournament: {
    id: string
    reEntry: number
    addon: number
    knockouts: number
    bustoutOrder: number
    status: string
    updatedAt: Date
  } | null
}

export function presentTournamentListItem(participant: TournamentListItem) {
  return {
    participantId: participant.id,
    externalParticipantId: participant.externalId,
    externalUserId: participant.externalUserId,
    status: participant.status,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    position: participant.position,
    user: {
      nickname: participant.userName,
      name: participant.userName,
      email: participant.userEmail,
      phone: participant.userPhone,
      telegramId: participant.userTelegramId,
      avatarUrl: participant.userAvatarUrl,
      badge: participant.badge,
    },
    tournament: {
      id: participant.tournament?.id ?? null,
      reEntry: participant.tournament?.reEntry ?? 0,
      addon: participant.tournament?.addon ?? 0,
      knockouts: participant.tournament?.knockouts ?? 0,
      bustoutOrder: participant.tournament?.bustoutOrder ?? 0,
      status: participant.tournament?.status ?? 'ACTIVE',
      updatedAt: participant.tournament?.updatedAt ?? null,
    },
  }
}
