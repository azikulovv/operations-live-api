import jwt from 'jsonwebtoken'
import type { StringValue } from 'ms'
import type { UserRole } from '@prisma/client'

import { env } from '@/config/env'

export type JwtPayload = {
  userId: string
  role: UserRole
}

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}
