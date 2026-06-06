import { getSocketServer } from '@/realtime/socket-server'

export const promotionRealtimeEvents = {
  updated: 'promotion:updated',
  listUpdated: 'promotions:list-updated',
} as const

export function emitPromotionUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(promotionRealtimeEvents.updated, payload)
}

export function emitPromotionListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(promotionRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
