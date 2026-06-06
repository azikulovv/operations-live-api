import z from 'zod'

export const eventParticipantsQuerySchema = z.object({
  eventId: z.string().min(1),
})

export const eventPariticipantsSchema = eventParticipantsQuerySchema

export type EventParticipantsQuery = z.infer<typeof eventParticipantsQuerySchema>
