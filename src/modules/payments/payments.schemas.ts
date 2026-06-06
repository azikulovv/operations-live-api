import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const participantIdParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updatePaymentSchema = z.object({
  accruedAmount: z.number().int().min(0).optional(),
  discountAmount: z.number().int().min(0).optional(),
  paidAmount: z.number().int().min(0).optional(),
  status: z.string().trim().min(1).optional(),
  comment: z.string().trim().nullable().optional(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>
export type UpdatePaymentDto = z.infer<typeof updatePaymentSchema>
