import { UserRole } from '@prisma/client'
import { prisma } from '@/database/prisma'
import { unauthorized } from '@/common/errors/app-error'
import { verifyPassword } from '@/common/utils/password'
import { signAccessToken } from '@/common/utils/jwt'
import type { SignInDto } from '@/modules/auth/auth.schemas'

export class AuthService {
  async signIn(dto: SignInDto) {
    const user = await prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (!user) {
      throw unauthorized('Неверный email или пароль')
    }

    const isValidPassword = await verifyPassword(dto.password, user.passwordHash)

    if (!isValidPassword) {
      throw unauthorized('Неверный email или пароль')
    }

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    }
  }
}
