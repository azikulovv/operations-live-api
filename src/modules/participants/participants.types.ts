import type { ExternalEvent } from '@/modules/events/events.types'

export type ExternalParticipant = {
  id: string
  userId: string
  eventId: string
  status: string
  createdAt: string
  cancelledAt: string | null
  position: number | null
  tableNumber: number | null
  seatNumber: number | null
  badge?: string | null
  user?: {
    username?: string | null
    email?: string | null
    phone?: string | null
    telegramId?: string | null
    avatarUrl?: string | null
    badge?: string | null
  }
}

export type EventParticipantsResponse = {
  event: ExternalEvent
  participants: ExternalParticipant[]
}
