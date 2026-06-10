import { getSocketServer } from '@/realtime/socket-server'

export const participantRealtimeEvents = {
  updated: 'participant:updated',
  listUpdated: 'participants:list-updated',
} as const

export function emitParticipantUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(participantRealtimeEvents.updated, payload)
}

export function emitParticipantListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(participantRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
