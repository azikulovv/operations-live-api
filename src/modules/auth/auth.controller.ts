import type { Request, Response } from 'express'
import { AuthService } from '@/modules/auth/auth.service'

const authService = new AuthService()

export class AuthController {
  async signIn(req: Request, res: Response) {
    const result = await authService.signIn(req.body)
    res.json(result)
  }
}
