import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const participantIdParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updatePromotionSchema = z.object({
  promotionType: z.string().trim().nullable().optional(),
  reason: z.string().trim().nullable().optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
  used: z.number().int().min(0).optional(),
  comment: z.string().trim().nullable().optional(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>
export type UpdatePromotionDto = z.infer<typeof updatePromotionSchema>
