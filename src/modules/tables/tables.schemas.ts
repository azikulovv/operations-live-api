import { z } from 'zod'

export const eventIdParamsSchema = z.object({
  eventId: z.string().min(1),
})

export const tableParamsSchema = z.object({
  eventId: z.string().min(1),
  tableNumber: z.coerce.number().int().min(1),
})

export const updateTableSchema = z
  .object({
    playersCount: z.number().int().min(0).optional(),
    maxPlayers: z.number().int().min(1).optional(),
    status: z.string().trim().min(1).optional(),
    comment: z.string().trim().nullable().optional(),
  })
  .refine(
    data =>
      data.playersCount === undefined ||
      data.maxPlayers === undefined ||
      data.playersCount <= data.maxPlayers,
    {
      path: ['playersCount'],
      message: 'playersCount must be less than or equal to maxPlayers',
    },
  )

export type EventIdParams = z.infer<typeof eventIdParamsSchema>
export type TableParams = z.infer<typeof tableParamsSchema>
export type UpdateTableDto = z.infer<typeof updateTableSchema>
