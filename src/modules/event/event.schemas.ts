import z from 'zod'

export const eventPariticipantsSchema = z.object({
  eventId: z.string().min(1),
})

export type EventParticipantsQuery = z.infer<typeof eventPariticipantsSchema>
