import type { RequestHandler } from 'express'
import type { UserRole } from '@prisma/client'

import { forbidden, unauthorized } from '@/common/errors/app-error'
import { verifyAccessToken } from '@/common/utils/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        role: UserRole
      }
    }
  }
}

export const auth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return next(unauthorized())
  }

  const token = header.replace('Bearer ', '')

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    next(unauthorized())
  }
}

export function allowRoles(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(unauthorized())
    }

    if (!roles.includes(req.user.role)) {
      return next(forbidden())
    }

    next()
  }
}
