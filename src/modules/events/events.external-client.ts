import { apiRequest } from '@/api/api.client'
import type { ActiveEventsResponse, UpcomingEventsResponse } from '@/modules/events/events.types'

export async function fetchActiveEvents() {
  return apiRequest<ActiveEventsResponse>('/events/active-now')
}

export async function fetchUpcomingEvents() {
  return apiRequest<UpcomingEventsResponse>('/events/upcoming')
}
