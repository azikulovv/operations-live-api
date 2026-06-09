import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const participantIdParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updateFinalTableSchema = z.object({
  seat: z.number().int().min(1).max(9),
  stack: z.number().int().min(0),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>
export type UpdateFinalTableDto = z.infer<typeof updateFinalTableSchema>
