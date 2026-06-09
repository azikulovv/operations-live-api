import { getSocketServer } from '@/realtime/socket-server'

export const debtRealtimeEvents = {
  updated: 'debt:updated',
  listUpdated: 'debts:list-updated',
} as const

export function emitDebtUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(debtRealtimeEvents.updated, payload)
}

export function emitDebtListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(debtRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
