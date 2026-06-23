import { calculateTournamentToPayAmount } from '@/modules/payments/payments.calculator'

type PaymentListItem = {
  id: string
  externalId: string
  externalUserId: string
  status: string
  tableNumber: number | null
  seatNumber: number | null
  position: number | null
  initialDepositAmount: number
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
  bartenderSale: {
    amount: number
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
  const initialDepositAmount = participant.initialDepositAmount ?? 0
  const discountAmount = participant.payment?.discountAmount ?? 0
  const promotionDiscountPercent =
    participant.promotion?.promotionType === 'DEALER'
      ? participant.promotion.discountPercent
      : 0
  const toPayAmount = calculateTournamentToPayAmount({
    accruedAmount: initialDepositAmount,
    discountAmount,
    promotionDiscountPercent,
  })
  const barAmount = participant.bartenderSale?.amount ?? 0
  const totalToPayAmount = toPayAmount + barAmount

  return {
    participantId: participant.id,
    externalParticipantId: participant.externalId,
    externalUserId: participant.externalUserId,
    participantStatus: participant.status,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    position: participant.position,
    initialDepositAmount,
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
      barAmount,
      totalToPayAmount,
      paidAmount: participant.payment?.paidAmount ?? 0,
      status: participant.payment?.status ?? 'UNPAID',
      comment: participant.payment?.comment ?? null,
      updatedAt: participant.payment?.updatedAt ?? null,
    },
    promotion: participant.promotion,
  }
}
