import cors from 'cors'
import express from 'express'

import { env } from '@/config/env'
import { authRoutes } from '@/modules/auth/auth.routes'
import { eventsRoutes } from '@/modules/events/events.routes'
import { errorMiddleware } from '@/common/middlewares/error.middleware'

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
app.use('/api/events', eventsRoutes)

app.use(errorMiddleware)
