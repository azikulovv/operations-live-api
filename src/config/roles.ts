import { UserRole } from '@prisma/client'

export const ROLE_LABELS: Record<UserRole, string> = {
  MANAGER: 'Управляющий',
  ADMIN: 'Админ',
  HOSTESS: 'Хостес',
  BARTENDER: 'Бармен',
}

export const ROLE_PRIORITY: Record<UserRole, number> = {
  MANAGER: 100,
  ADMIN: 80,
  HOSTESS: 50,
  BARTENDER: 30,
}
