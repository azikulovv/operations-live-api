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

export interface ParticipantUser {
  id: string
  avatarUrl: string
  avatarHash: string
  email: string
  username: string
  phone: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Participant {
  id: string
  userId: string
  eventId: string
  status: string
  createdAt: Date | string
  cancelledAt: Date | string | null
  position: number | null
  tableNumber: number
  seatNumber: number
  user: ParticipantUser
}

export interface GetExternalEventParticipantsDto {
  participants: Participant[]
}
