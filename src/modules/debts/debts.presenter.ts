type DebtListItem = {
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
  debt: {
    id: string
    amount: number
    comment: string | null
    closed: boolean
    updatedAt: Date
  } | null
}

export function presentDebtListItem(participant: DebtListItem) {
  return {
    participantId: participant.id,
    externalParticipantId: participant.externalId,
    externalUserId: participant.externalUserId,
    status: participant.status,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    position: participant.position,
    user: {
      name: participant.userName,
      email: participant.userEmail,
      phone: participant.userPhone,
      telegramId: participant.userTelegramId,
      avatarUrl: participant.userAvatarUrl,
      badge: participant.badge,
    },
    debt: {
      id: participant.debt?.id ?? null,
      amount: participant.debt?.amount ?? 0,
      comment: participant.debt?.comment ?? null,
      closed: participant.debt?.closed ?? false,
      updatedAt: participant.debt?.updatedAt ?? null,
    },
  }
}
