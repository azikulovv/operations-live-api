import { AppError } from '@/common/errors/app-error'
import type { ErrorRequestHandler } from 'express'

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { errors: error.details } : {}),
    })
    return
  }

  console.error(error)

  res.status(500).json({
    message: 'Внутренняя ошибка сервера',
  })
}
