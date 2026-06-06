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
  reminderSent1h: false
  reminderSent10m: false
  participantLimit: number
  seatsPerTable: number
  pointsForParticipation: number
  isTemplate: false
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
