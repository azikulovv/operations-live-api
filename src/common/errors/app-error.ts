export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
  }
}

export const badRequest = (message: string) => new AppError(400, message)
export const unauthorized = (message = 'Не авторизован') => new AppError(401, message)
export const forbidden = (message = 'Недостаточно прав') => new AppError(403, message)
export const notFound = (message = 'Не найдено') => new AppError(404, message)
export const conflict = (message: string) => new AppError(409, message)
