import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const participantIdParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updateDebtSchema = z.object({
  amount: z.number().int().min(0).optional(),
  comment: z.string().trim().nullable().optional(),
  closed: z.boolean().optional(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>
export type UpdateDebtDto = z.infer<typeof updateDebtSchema>
