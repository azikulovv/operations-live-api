type BartenderSaleListItem = {
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
  bartenderSale: {
    id: string
    amount: number
    comment: string | null
    updatedAt: Date
  } | null
}

export function presentBartenderSaleListItem(participant: BartenderSaleListItem) {
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
    bartenderSale: {
      id: participant.bartenderSale?.id ?? null,
      amount: participant.bartenderSale?.amount ?? 0,
      comment: participant.bartenderSale?.comment ?? null,
      updatedAt: participant.bartenderSale?.updatedAt ?? null,
    },
  }
}
