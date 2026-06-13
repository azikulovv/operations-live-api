import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const participantIdParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updateParticipantParamsSchema = eventIdParamsSchema.merge(participantIdParamsSchema)

export const updateParticipantSchema = z.object({
  status: z.string().trim().min(1).optional(),
  position: z.number().int().min(0).nullable().optional(),
  tableNumber: z.number().int().min(1).nullable().optional(),
  seatNumber: z.number().int().min(1).nullable().optional(),
  userName: z.string().trim().nullable().optional(),
  userEmail: z.string().trim().email().nullable().optional(),
  userPhone: z.string().trim().nullable().optional(),
  userTelegramId: z.string().trim().nullable().optional(),
  userAvatarUrl: z.string().trim().url().nullable().optional(),
  badge: z.string().trim().nullable().optional(),
  arrived: z.boolean().optional(),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type ParticipantIdParams = z.infer<typeof participantIdParamsSchema>
export type UpdateParticipantParams = z.infer<typeof updateParticipantParamsSchema>
export type UpdateParticipantDto = z.infer<typeof updateParticipantSchema>
