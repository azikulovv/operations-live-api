import { getSocketServer } from '@/realtime/socket-server'

export const tournamentRealtimeEvents = {
  updated: 'tournament:updated',
  listUpdated: 'tournament:list-updated',
} as const

export function emitTournamentUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(tournamentRealtimeEvents.updated, payload)
}

export function emitTournamentListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(tournamentRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
