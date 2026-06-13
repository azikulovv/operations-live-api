import type { Prisma } from '@prisma/client'

import type { ExternalParticipant } from '@/modules/participants/participants.types'

export function mapExternalParticipantToCreateInput(
  participant: ExternalParticipant,
  eventId: string,
): Prisma.EventParticipantCreateManyInput {
  return {
    externalId: participant.id,
    externalUserId: participant.userId,
    eventId,
    status: participant.status,
    registeredAt: new Date(participant.createdAt),
    cancelledAt: participant.cancelledAt ? new Date(participant.cancelledAt) : null,
    position: participant.position,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    userName: participant.user?.username ?? null,
    userEmail: participant.user?.email ?? null,
    userPhone: participant.user?.phone ?? null,
    userTelegramId: participant.user?.telegramId ?? null,
    userAvatarUrl: participant.user?.avatarUrl ?? null,
    badge: null,
  }
}

export function mapExternalParticipantToSyncUpdateInput(
  participant: ExternalParticipant,
): Prisma.EventParticipantUpdateManyMutationInput {
  return {
    externalUserId: participant.userId,
    status: participant.status,
    cancelledAt: participant.cancelledAt ? new Date(participant.cancelledAt) : null,
    position: participant.position,
    userName: participant.user?.username ?? null,
    userEmail: participant.user?.email ?? null,
    userPhone: participant.user?.phone ?? null,
    userTelegramId: participant.user?.telegramId ?? null,
    userAvatarUrl: participant.user?.avatarUrl ?? null,
  }
}
