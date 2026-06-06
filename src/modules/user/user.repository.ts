import { PrismaClient } from '@prisma/client'

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }
}
