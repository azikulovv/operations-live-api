import { getSocketServer } from '@/realtime/socket-server'

export const finalTableRealtimeEvents = {
  updated: 'final-table:updated',
  listUpdated: 'final-table:list-updated',
} as const

export function emitFinalTableUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(finalTableRealtimeEvents.updated, payload)
}

export function emitFinalTableListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(finalTableRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
