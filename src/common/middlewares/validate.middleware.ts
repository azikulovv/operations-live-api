import type { RequestHandler } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import type { ZodError, ZodSchema } from 'zod'
import { badRequest } from '@/common/errors/app-error'

type Schemas = {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

function formatErrors(scope: keyof Schemas, error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join('.') : scope,
    message: issue.message,
  }))
}

export function validate(schemas: Schemas): RequestHandler {
  return (req, _res, next) => {
    const body = schemas.body?.safeParse(req.body)
    const params = schemas.params?.safeParse(req.params)
    const query = schemas.query?.safeParse(req.query)

    if (body && !body.success) {
      return next(badRequest('Некорректное тело запроса', formatErrors('body', body.error)))
    }

    if (params && !params.success) {
      return next(badRequest('Некорректные параметры', formatErrors('params', params.error)))
    }

    if (query && !query.success) {
      return next(badRequest('Некорректный query', formatErrors('query', query.error)))
    }

    if (body?.success) req.body = body.data
    if (params?.success) req.params = params.data as ParamsDictionary
    if (query?.success) req.query = query.data as ParsedQs

    next()
  }
}
