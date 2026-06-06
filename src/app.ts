import cors from 'cors'
import express from 'express'

import { env } from '@/config/env'
import { authRoutes } from '@/modules/auth/auth.routes'
import { eventsRoutes } from '@/modules/events/events.routes'
import { eventPaymentsRoutes, paymentsRoutes } from '@/modules/payments/payments.routes'
import { participantsRoutes } from '@/modules/participants/participants.routes'
import { eventPromotionsRoutes, promotionsRoutes } from '@/modules/promotions/promotions.routes'
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
app.use('/api/events/:eventId/payments', eventPaymentsRoutes)
app.use('/api/events/:eventId/promotions', eventPromotionsRoutes)
app.use('/api/events/:eventId/participants', participantsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/promotions', promotionsRoutes)

app.use(errorMiddleware)
