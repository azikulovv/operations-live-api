import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const participantIdParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updateTournamentSchema = z.object({
  reEntry: z.number().int().min(0).optional(),
  addon: z.number().int().min(0).optional(),
  knockouts: z.number().int().min(0).optional(),
  bustoutOrder: z.number().int().min(0).optional(),
  status: z.string().trim().min(1).optional(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>
export type UpdateTournamentDto = z.infer<typeof updateTournamentSchema>
