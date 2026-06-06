import 'dotenv/config'
import { PrismaClient, UserRole } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({
  url: String(process.env.DATABASE_URL),
})

const prisma = new PrismaClient({
  adapter,
})

const users = [
  {
    email: 'manager@duck.local',
    name: 'Управляющий',
    password: 'password123',
    role: UserRole.MANAGER,
  },
  {
    email: 'admin@duck.local',
    name: 'Админ',
    password: 'password123',
    role: UserRole.ADMIN,
  },
  {
    email: 'hostess@duck.local',
    name: 'Хостес',
    password: 'password123',
    role: UserRole.HOSTESS,
  },
  {
    email: 'bartender@duck.local',
    name: 'Бармен',
    password: 'password123',
    role: UserRole.BARTENDER,
  },
]

async function main() {
  console.log('🌱 Seed started...')

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10)

    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      },
    })

    console.log(`✅ User created/updated: ${user.email} — ${user.role}`)
  }

  console.log('🌱 Seed finished.')
}

main()
  .catch(error => {
    console.error('❌ Seed error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
