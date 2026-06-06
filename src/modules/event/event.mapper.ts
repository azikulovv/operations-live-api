import type { EventParticipant, EventParticipantPayment, Prisma } from '@prisma/client'
import type { ExternalEventDto, Participant } from './event.types'

export type EventParticipantWithPayment = EventParticipant & {
  payment: EventParticipantPayment | null
}

function mapExternalEventToPersistenceInput(event: ExternalEventDto) {
  return {
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

export function mapExternalEventToCreateInput(
  event: ExternalEventDto,
): Prisma.EventUncheckedCreateInput {
  return {
    externalId: event.id,
    ...mapExternalEventToPersistenceInput(event),
  }
}

export function mapExternalEventToUpdateInput(
  event: ExternalEventDto,
): Prisma.EventUncheckedUpdateInput {
  return mapExternalEventToPersistenceInput(event)
}

export function mapExternalParticipantToUpsertInput(
  participant: Participant,
  eventId: string,
): Prisma.EventParticipantUncheckedCreateInput {
  return {
    externalId: participant.id,
    externalUserId: participant.userId,
    eventId,
    status: participant.status,
    createdAt: new Date(participant.createdAt),
    cancelledAt: participant.cancelledAt ? new Date(participant.cancelledAt) : null,
    position: participant.position,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    userAvatarUrl: participant.user.avatarUrl ?? null,
    userAvatarHash: participant.user.avatarHash ?? null,
    userEmail: participant.user.email,
    userUsername: participant.user.username,
    userPhone: participant.user.phone,
    userRole: participant.user.role,
    userCreatedAt: new Date(participant.user.createdAt),
    userUpdatedAt: new Date(participant.user.updatedAt),
  }
}

export function mapEventParticipantToParticipant(
  participant: EventParticipantWithPayment,
  externalEventId: string,
): Participant {
  return {
    id: participant.externalId,
    userId: participant.externalUserId,
    eventId: externalEventId,
    status: participant.status,
    createdAt: participant.createdAt,
    cancelledAt: participant.cancelledAt,
    position: participant.position,
    tableNumber: participant.tableNumber,
    seatNumber: participant.seatNumber,
    userBadge: participant.userBadge,
    closed: participant.closed,
    user: {
      id: participant.externalUserId,
      avatarUrl: participant.userAvatarUrl ?? '',
      avatarHash: participant.userAvatarHash ?? '',
      email: participant.userEmail,
      username: participant.userUsername,
      phone: participant.userPhone,
      role: participant.userRole,
      createdAt: participant.userCreatedAt.toISOString(),
      updatedAt: participant.userUpdatedAt.toISOString(),
    },
    payment: participant.payment
      ? {
          id: participant.payment.id,
          participantId: participant.payment.participantId,
          tournament: participant.payment.tournament,
          bar: participant.payment.bar,
          games: participant.payment.games,
          paid: participant.payment.paid,
          createdAt: participant.payment.createdAt,
          updatedAt: participant.payment.updatedAt,
        }
      : null,
  }
}
