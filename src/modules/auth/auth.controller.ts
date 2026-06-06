import type { Request, Response } from 'express'
import { AuthService } from '@/modules/auth/auth.service'
import { unauthorized } from '@/common/errors/app-error'

const authService = new AuthService()

export class AuthController {
  async signIn(req: Request, res: Response) {
    const result = await authService.signIn(req.body)
    res.json(result)
  }

  async me(req: Request, res: Response) {
    if (!req.user?.userId) throw unauthorized()
    const result = await authService.me(req.user.userId)
    res.json(result)
  }
}
