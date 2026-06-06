import type { ExternalEventDto } from './event.types'

export function mapExternalEventToCreateInput(event: ExternalEventDto) {
  return {
    externalId: event.id,
    title: event.title,
    city: event.city,
    address: event.address,
    features: event.features ?? '',
    gameRules: event.gameRules ?? '',
    gameType: event.gameType,
    startsAt: new Date(event.startsAt),
    endsAt: event.endsAt ? new Date(event.endsAt) : null,
    participantLimit: event.participantLimit,
    imageUrl: event.imageUrl ?? null,
    imageHash: event.imageHash ?? null,
    status: event.status,
    registrationCount: event._count.registrations,
  }
}
