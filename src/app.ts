import cors from 'cors'
import express from 'express'

import { env } from '@/config/env'
import { authRoutes } from '@/modules/auth/auth.routes'
import { errorMiddleware } from '@/common/middlewares/error.middleware'
import { eventRoutes } from './modules/event/event.routes'

export const app = express()

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
)

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'operations-live-api',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

app.use(errorMiddleware)
