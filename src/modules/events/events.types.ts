export type ExternalEvent = {
  id: string
  title: string
  city: string
  address: string
  gameType: string
  startsAt: string
  endsAt: string | null
  status: string
  participantLimit: number | null
  seatsPerTable: number | null
  tableCount: number | null
  _count?: {
    registrations?: number
  }
}

export type ActiveEventsResponse = {
  data: ExternalEvent[]
}

export type UpcomingEventsResponse = {
  data: ExternalEvent[]
}
