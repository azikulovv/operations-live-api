import { Router } from 'express'

import { validate } from '@/common/middlewares/validate.middleware'
import { AuthController } from '@/modules/auth/auth.controller'
import { signInSchema } from '@/modules/auth/auth.schemas'

export const authRoutes = Router()

const controller = new AuthController()

authRoutes.post('/signin', validate({ body: signInSchema }), controller.signIn)
