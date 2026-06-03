import 'dotenv/config'
import { z } from 'zod'

const envDescriptions = {
  NODE_ENV: 'Режим запуска приложения: development, production или test',
  PORT: 'Порт, на котором будет запускаться backend-сервер',
  BACKEND_URL: 'Публичный URL backend API, например: http://localhost:5000',
  FRONTEND_URL: 'Публичный URL frontend-приложения, например: http://localhost:3000',
  DATABASE_URL: 'Строка подключения к базе данных, например SQLite или PostgreSQL',
  JWT_SECRET: 'Секретный ключ для подписи JWT-токенов. Минимум 32 символа',
  JWT_EXPIRES_IN: 'Время жизни JWT-токена, например: 7d, 24h, 30m',
  EXTERNAL_API_URL: 'URL внешнего API, к которому backend будет делать запросы',
  EXTERNAL_API_KEY: 'Ключ доступа к внешнему API',
} as const

const envExamples = {
  NODE_ENV: 'development',
  PORT: '5000',
  BACKEND_URL: 'http://localhost:5000',
  FRONTEND_URL: 'http://localhost:3000',
  DATABASE_URL: 'file:./dev.db',
  JWT_SECRET: 'super-secret-jwt-key-minimum-32-characters',
  JWT_EXPIRES_IN: '7d',
  EXTERNAL_API_URL: 'https://api.example.com',
  EXTERNAL_API_KEY: 'your-external-api-key',
} as const

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'], {
      message: envDescriptions.NODE_ENV,
    })
    .default('development'),

  PORT: z.coerce
    .number({
      message: envDescriptions.PORT,
    })
    .int('PORT должен быть целым числом')
    .positive('PORT должен быть положительным числом')
    .default(5000),

  BACKEND_URL: z
    .string({
      message: envDescriptions.BACKEND_URL,
    })
    .url('BACKEND_URL должен быть корректным URL'),

  FRONTEND_URL: z
    .string({
      message: envDescriptions.FRONTEND_URL,
    })
    .url('FRONTEND_URL должен быть корректным URL'),

  DATABASE_URL: z
    .string({
      message: envDescriptions.DATABASE_URL,
    })
    .min(1, 'DATABASE_URL не должен быть пустым'),

  JWT_SECRET: z
    .string({
      message: envDescriptions.JWT_SECRET,
    })
    .min(32, 'JWT_SECRET должен быть минимум 32 символа'),

  JWT_EXPIRES_IN: z
    .string({
      message: envDescriptions.JWT_EXPIRES_IN,
    })
    .default('7d'),

  EXTERNAL_API_URL: z
    .string({
      message: envDescriptions.EXTERNAL_API_URL,
    })
    .url('EXTERNAL_API_URL должен быть корректным URL'),

  EXTERNAL_API_KEY: z
    .string({
      message: envDescriptions.EXTERNAL_API_KEY,
    })
    .min(1, 'EXTERNAL_API_KEY не должен быть пустым'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('\n❌ Ошибка в .env файле\n')

  const errors = parsedEnv.error.flatten().fieldErrors

  for (const [key, messages] of Object.entries(errors)) {
    const envKey = key as keyof typeof envDescriptions

    console.error(`🔴 ${key}`)
    console.error(`   Причина: ${messages?.join(', ')}`)
    console.error(`   Зачем нужна: ${envDescriptions[envKey]}`)
    console.error(`   Пример: ${key}=${envExamples[envKey]}`)
    console.error('')
  }

  process.exit(1)
}

export const env = parsedEnv.data
