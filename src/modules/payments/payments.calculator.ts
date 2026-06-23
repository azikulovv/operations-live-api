export function calculatePromotionDiscountAmount(
  accruedAmount: number,
  promotionDiscountPercent: number,
) {
  return Math.floor((accruedAmount * promotionDiscountPercent) / 100)
}

export function calculateTournamentToPayAmount(payment: {
  accruedAmount?: number | null
  discountAmount?: number | null
  promotionDiscountPercent?: number | null
}) {
  const accruedAmount = payment.accruedAmount ?? 0
  const discountAmount = payment.discountAmount ?? 0
  const promotionDiscountPercent = payment.promotionDiscountPercent ?? 0
  const promotionDiscountAmount = calculatePromotionDiscountAmount(
    accruedAmount,
    promotionDiscountPercent,
  )

  return Math.max(accruedAmount - discountAmount - promotionDiscountAmount, 0)
}
