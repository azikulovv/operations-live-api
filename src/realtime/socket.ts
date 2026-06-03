import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'

import { env } from '@/config/env'

export let io: Server

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      // origin: env.FRONTEND_URL,
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`)

    socket.emit('connected', {
      message: 'Realtime подключение активно',
    })

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`)
    })
  })

  return io
}
