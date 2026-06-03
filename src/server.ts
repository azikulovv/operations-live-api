import http from 'node:http'

import { app } from '@/app'
import { env } from '@/config/env'
import { initSocket } from '@/realtime/socket'

const server = http.createServer(app)

initSocket(server)

server.listen(env.PORT, () => {
  console.log(`🚀 API запущен: ${env.BACKEND_URL}`)
})
