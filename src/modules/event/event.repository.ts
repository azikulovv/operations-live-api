import { externalApiRequest } from '@/external/external-api.client'
import { GetExternalEventResponse } from './event.types'

export class EventRepository {
  async findActiveEvents() {
    return externalApiRequest<GetExternalEventResponse>('/events/active-now', { method: 'GET' })
  }
}
