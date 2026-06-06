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
  participantLimit: number
  status: string
  createdAt: string
  updatedAt: string
  _count: {
    registrations: number
  }
}

export interface EventItem {
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
  participantLimit: number
  status: string
  createdAt: string
  updatedAt: string
  registrationCount: number
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

export interface ParticipantPayment {
  id: string
  participantId: string
  tournament: number
  bar: number
  games: number
  paid: number
  createdAt: Date | string
  updatedAt: Date | string
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
  userBadge?: number | null
  closed: boolean
  user: ParticipantUser
  payment?: ParticipantPayment | null
}

export interface GetExternalEventParticipantsDto {
  participants: Participant[]
}
