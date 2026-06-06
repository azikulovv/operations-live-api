import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { AuthController } from '@/modules/auth/auth.controller'
import { signInSchema } from '@/modules/auth/auth.schemas'
import { auth } from '@/common/middlewares/auth.middleware'

export const authRoutes = Router()

const controller = new AuthController()

authRoutes.post('/signin', validate({ body: signInSchema }), controller.signIn)
authRoutes.get('/me', auth, controller.me)
