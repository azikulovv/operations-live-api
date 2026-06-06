import { apiRequest } from '@/api/api.client'
import type { ActiveEventsResponse } from '@/modules/events/events.types'

export async function fetchActiveEvents() {
  return apiRequest<ActiveEventsResponse>('/events/active-now')
}
