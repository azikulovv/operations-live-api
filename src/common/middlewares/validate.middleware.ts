import type { RequestHandler } from 'express'
import type { ZodSchema } from 'zod'
import { badRequest } from '@/common/errors/app-error'

type Schemas = {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export function validate(schemas: Schemas): RequestHandler {
  return (req, _res, next) => {
    const body = schemas.body?.safeParse(req.body)
    const params = schemas.params?.safeParse(req.params)
    const query = schemas.query?.safeParse(req.query)

    if (body && !body.success) return next(badRequest('Некорректное тело запроса'))
    if (params && !params.success) return next(badRequest('Некорректные параметры'))
    if (query && !query.success) return next(badRequest('Некорректный query'))

    if (body?.success) req.body = body.data
    if (params?.success) req.params = params.data
    if (query?.success) req.query = query.data

    next()
  }
}
