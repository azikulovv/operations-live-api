import { apiRequest } from '@/api/api.client'
import type { EventParticipantsResponse } from '@/modules/participants/participants.types'

export async function fetchEventParticipants(eventId: string) {
  return apiRequest<EventParticipantsResponse>(`/events/${eventId}/participants`)
}
