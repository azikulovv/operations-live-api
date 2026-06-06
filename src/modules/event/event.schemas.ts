import z from 'zod'

export const eventParticipantsQuerySchema = z.object({
  eventId: z.string().min(1),
})

export const eventParticipantParamsSchema = z.object({
  participantId: z.string().min(1),
})

export const updateEventParticipantSchema = z
  .object({
    userBadge: z.number().int().nonnegative().nullable().optional(),
    payment: z
      .object({
        tournament: z.number().int().nonnegative().optional(),
        bar: z.number().int().nonnegative().optional(),
        games: z.number().int().nonnegative().optional(),
        paid: z.number().int().nonnegative().optional(),
      })
      .optional(),
  })
  .refine(dto => dto.userBadge !== undefined || dto.payment !== undefined, {
    message: 'Нужно передать хотя бы одно поле для обновления',
  })

export const eventPariticipantsSchema = eventParticipantsQuerySchema

export type EventParticipantsQuery = z.infer<typeof eventParticipantsQuerySchema>
export type EventParticipantParams = z.infer<typeof eventParticipantParamsSchema>
export type UpdateEventParticipantDto = z.infer<typeof updateEventParticipantSchema>
