import { getSocketServer } from '@/realtime/socket-server'

export const bartenderSaleRealtimeEvents = {
  updated: 'bartender-sale:updated',
  listUpdated: 'bartender-sales:list-updated',
} as const

export function emitBartenderSaleUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(bartenderSaleRealtimeEvents.updated, payload)
}

export function emitBartenderSaleListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(bartenderSaleRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
