import type { Prisma } from '@prisma/client'

import type { ExternalEvent } from '@/modules/events/events.types'

export function mapExternalEventToCreateInput(event: ExternalEvent): Prisma.EventCreateManyInput {
  return {
    externalId: event.id,
    title: event.title,
    city: event.city,
    address: event.address,
    gameType: event.gameType,
    startsAt: new Date(event.startsAt),
    endsAt: event.endsAt ? new Date(event.endsAt) : null,
    status: event.status,
    participantLimit: event.participantLimit,
    initialDepositAmount: event.initialDepositAmount ?? 0,
    seatsPerTable: event.seatsPerTable,
    tableCount: event.tableCount ?? 0,
    registrationsCount: event._count?.registrations ?? 0,
  }
}
