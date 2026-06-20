type FinalTableListItem = {
  id: string
  seat: number
  stack: number
  updatedAt: Date
  participant: {
    id: string
    externalId: string
    externalUserId: string
    userName: string | null
    userEmail: string | null
    badge: string | null
  }
}

export function presentFinalTableListItem(item: FinalTableListItem) {
  return {
    id: item.id,
    participantId: item.participant.id,
    externalParticipantId: item.participant.externalId,
    externalUserId: item.participant.externalUserId,
    seat: item.seat,
    badge: item.participant.badge,
    nickname: item.participant.userName,
    email: item.participant.userEmail,
    stack: item.stack,
    updatedAt: item.updatedAt,
  }
}
