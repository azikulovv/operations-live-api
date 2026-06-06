import { externalApiRequest } from '@/external/external-api.client'
import {
  GetExternalEventResponse,
  GetExternalEventParticipantsDto,
  Participant,
} from './event.types'

export class EventRepository {
  async findActiveEvents() {
    return externalApiRequest<GetExternalEventResponse>('/events/active-now', { method: 'GET' })
  }

  async findEventParticipants(eventId: string): Promise<{ data: Participant[] }> {
    const response = await externalApiRequest<GetExternalEventParticipantsDto>(
      `/events/${eventId}/participants`,
      {
        method: 'GET',
      },
    )
    return { data: response.participants }
  }
}
