type PromotionListItem = {
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
  promotion: {
    id: string
    promotionType: string | null
    reason: string | null
    discountPercent: number
    used: number
    comment: string | null
    updatedAt: Date
  } | null
}

export function presentPromotionListItem(participant: PromotionListItem) {
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
    promotion: {
      id: participant.promotion?.id ?? null,
      promotionType: participant.promotion?.promotionType ?? null,
      reason: participant.promotion?.reason ?? null,
      discountPercent: participant.promotion?.discountPercent ?? 0,
      used: participant.promotion?.used ?? 0,
      comment: participant.promotion?.comment ?? null,
      updatedAt: participant.promotion?.updatedAt ?? null,
    },
  }
}
