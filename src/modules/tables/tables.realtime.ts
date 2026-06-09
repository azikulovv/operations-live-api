import { getSocketServer } from '@/realtime/socket-server'

export const tableRealtimeEvents = {
  updated: 'table:updated',
  listUpdated: 'tables:list-updated',
} as const

export function emitTableUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(tableRealtimeEvents.updated, payload)
}

export function emitTableListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(tableRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
