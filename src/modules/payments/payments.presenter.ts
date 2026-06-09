type PaymentListItem = {
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
  payment: {
    id: string
    accruedAmount: number
    discountAmount: number
    paidAmount: number
    status: string
    comment: string | null
    updatedAt: Date
  } | null
  promotion: {
    id: string
    participantId: string
    promotionType: string | null
    reason: string | null
    discountPercent: number
    used: number
    comment: string | null
    createdAt: Date | string
    updatedAt: Date | string
  } | null
}

export function presentPaymentListItem(participant: PaymentListItem) {
  const accruedAmount = participant.payment?.accruedAmount ?? 0
  const discountAmount = participant.payment?.discountAmount ?? 0
  const toPayAmount = Math.max(accruedAmount - discountAmount, 0)

  return {
    participantId: participant.id,
    externalParticipantId: participant.externalId,
    externalUserId: participant.externalUserId,
    participantStatus: participant.status,
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
    payment: {
      id: participant.payment?.id ?? null,
      accruedAmount,
      discountAmount,
      toPayAmount,
      paidAmount: participant.payment?.paidAmount ?? 0,
      status: participant.payment?.status ?? 'UNPAID',
      comment: participant.payment?.comment ?? null,
      updatedAt: participant.payment?.updatedAt ?? null,
    },
    promotion: participant.promotion,
  }
}
