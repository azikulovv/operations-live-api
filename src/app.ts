import cors from 'cors'
import express from 'express'

import { env } from '@/config/env'
import { authRoutes } from '@/modules/auth/auth.routes'
import {
  bartenderSalesRoutes,
  eventBartenderSalesRoutes,
} from '@/modules/bartender-sales/bartender-sales.routes'
import { debtsRoutes, eventDebtsRoutes } from '@/modules/debts/debts.routes'
import { eventsRoutes } from '@/modules/events/events.routes'
import { eventFinalTableRoutes, finalTableRoutes } from '@/modules/final-table/final-table.routes'
import { eventPaymentsRoutes, paymentsRoutes } from '@/modules/payments/payments.routes'
import { participantsRoutes } from '@/modules/participants/participants.routes'
import { eventPromotionsRoutes, promotionsRoutes } from '@/modules/promotions/promotions.routes'
import { eventShiftDashboardRoutes } from '@/modules/shift-dashboard/shift-dashboard.routes'
import { eventTablesRoutes } from '@/modules/tables/tables.routes'
import { eventTournamentRoutes, tournamentRoutes } from '@/modules/tournament/tournament.routes'
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
app.use('/api/events/:eventId/bartender-sales', eventBartenderSalesRoutes)
app.use('/api/events/:eventId/debts', eventDebtsRoutes)
app.use('/api/events/:eventId/final-table', eventFinalTableRoutes)
app.use('/api/events/:eventId/payments', eventPaymentsRoutes)
app.use('/api/events/:eventId/promotions', eventPromotionsRoutes)
app.use('/api/events/:eventId/participants', participantsRoutes)
app.use('/api/events/:eventId/shift-dashboard', eventShiftDashboardRoutes)
app.use('/api/events/:eventId/tables', eventTablesRoutes)
app.use('/api/events/:eventId/tournament', eventTournamentRoutes)
app.use('/api/bartender-sales', bartenderSalesRoutes)
app.use('/api/debts', debtsRoutes)
app.use('/api/final-table', finalTableRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/promotions', promotionsRoutes)
app.use('/api/tournament', tournamentRoutes)

app.use(errorMiddleware)
