export interface ExternalEventDto {
  id: string
  imageUrl: string
  imageHash: string
  title: string
  city: string
  address: string
  features: string
  gameRules: string
  gameType: string
  startsAt: string
  endsAt: string
  reminderSent1h: boolean
  reminderSent10m: boolean
  participantLimit: number
  seatsPerTable: number
  pointsForParticipation: number
  status: string
  createdAt: string
  updatedAt: string
  _count: {
    registrations: number
  }
}
export interface GetExternalEventResponse {
  data: ExternalEventDto[] | null
}
