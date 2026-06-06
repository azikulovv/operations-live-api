import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'

import { env } from '@/config/env'
import { registerEventSocketHandlers } from '@/modules/event/event.realtime'
import { setSocketServer } from '@/realtime/socket-server'

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  })

  setSocketServer(io)

  io.on('connection', socket => {
    console.log(`Socket connected: ${socket.id}`)

    registerEventSocketHandlers(socket)

    socket.emit('connected', {
      message: 'Realtime подключение активно',
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}
