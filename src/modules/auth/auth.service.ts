import { prisma } from '@/database/prisma'
import { signAccessToken } from '@/common/utils/jwt'
import { unauthorized } from '@/common/errors/app-error'
import { verifyPassword } from '@/common/utils/password'
import { UserRepository } from '../user/user.repository'
import type { SignInDto } from '@/modules/auth/auth.schemas'

export class AuthService {
  private readonly userRepository = new UserRepository(prisma)

  async signIn(dto: SignInDto) {
    const user = await this.userRepository.findByEmail(dto.email)

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

  async me(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw unauthorized('Не удалось найти пользователя')
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
}
