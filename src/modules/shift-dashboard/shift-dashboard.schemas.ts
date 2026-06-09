import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
