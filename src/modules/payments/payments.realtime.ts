import { getSocketServer } from '@/realtime/socket-server'

export const paymentRealtimeEvents = {
  updated: 'payment:updated',
  listUpdated: 'payments:list-updated',
} as const

export function emitPaymentUpdated(payload: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(paymentRealtimeEvents.updated, payload)
}

export function emitPaymentListUpdated(eventId: string, data: unknown) {
  const io = getSocketServer()
  if (!io) return

  io.emit(paymentRealtimeEvents.listUpdated, {
    eventId,
    data,
  })
}
