import { externalApiRequest } from '@/external/external-api.client'
import type {
  ExternalEventDto,
  GetExternalEventParticipantsDto,
  GetExternalEventResponse,
  Participant,
} from './event.types'

export class EventExternalClient {
  async findActiveEvents(): Promise<ExternalEventDto[]> {
    const response = await externalApiRequest<GetExternalEventResponse>('/events/active-now', {
      method: 'GET',
    })

    return response.data ?? []
  }

  async findParticipants(externalEventId: string): Promise<Participant[]> {
    const response = await externalApiRequest<GetExternalEventParticipantsDto>(
      `/events/${externalEventId}/participants`,
      {
        method: 'GET',
      },
    )

    return response.participants ?? []
  }
}
