import express from 'express'
import cors from 'cors'

import { errorMiddleware } from '@/common/middlewares/error.middleware'
import { authRoutes } from '@/modules/auth/auth.routes'

export const app = express()

app.use(
  cors({
    // origin: env.FRONTEND_URL,
    credentials: true,
  }),
)

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'backend-core',
  })
})

app.use('/api/auth', authRoutes)

app.use(errorMiddleware)
