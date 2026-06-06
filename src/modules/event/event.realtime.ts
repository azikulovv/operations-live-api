import type { Socket } from 'socket.io'
import { getSocketServer } from '@/realtime/socket-server'
import type { Participant } from './event.types'

const ACTIVE_EVENTS_ROOM = 'events:active'

type EventSubscriptionPayload = {
  eventId?: unknown
}

export const eventSocketEvents = {
  activeSubscribe: 'events:active:subscribe',
  activeUnsubscribe: 'events:active:unsubscribe',
  activeUpdated: 'events:active:updated',
  participantsSubscribe: 'events:participants:subscribe',
  participantsUnsubscribe: 'events:participants:unsubscribe',
  participantsUpdated: 'events:participants:updated',
} as const

function getParticipantsRoom(eventId: string) {
  return `events:${eventId}:participants`
}

function getEventIdFromPayload(payload: EventSubscriptionPayload) {
  return typeof payload.eventId === 'string' && payload.eventId.trim()
    ? payload.eventId.trim()
    : null
}

export function registerEventSocketHandlers(socket: Socket) {
  socket.on(eventSocketEvents.activeSubscribe, () => {
    void socket.join(ACTIVE_EVENTS_ROOM)
  })

  socket.on(eventSocketEvents.activeUnsubscribe, () => {
    void socket.leave(ACTIVE_EVENTS_ROOM)
  })

  socket.on(eventSocketEvents.participantsSubscribe, (payload: EventSubscriptionPayload = {}) => {
    const eventId = getEventIdFromPayload(payload)

    if (!eventId) {
      return
    }

    void socket.join(getParticipantsRoom(eventId))
  })

  socket.on(eventSocketEvents.participantsUnsubscribe, (payload: EventSubscriptionPayload = {}) => {
    const eventId = getEventIdFromPayload(payload)

    if (!eventId) {
      return
    }

    void socket.leave(getParticipantsRoom(eventId))
  })
}

export function emitActiveEventsUpdated(events: unknown[]) {
  getSocketServer()?.to(ACTIVE_EVENTS_ROOM).emit(eventSocketEvents.activeUpdated, {
    data: events,
  })
}

export function emitEventParticipantsUpdated(eventIds: string[], participants: Participant[]) {
  const io = getSocketServer()

  if (!io) {
    return
  }

  const payload = {
    data: participants,
  }

  for (const eventId of eventIds) {
    io.to(getParticipantsRoom(eventId)).emit(eventSocketEvents.participantsUpdated, {
      eventId,
      ...payload,
    })
  }
}
