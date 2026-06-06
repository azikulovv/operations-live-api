import type { RequestHandler } from 'express'
import type { ZodError, ZodSchema } from 'zod'
import { badRequest } from '@/common/errors/app-error'

type Schemas = {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export type ValidatedRequestData = {
  body?: unknown
  params?: unknown
  query?: unknown
}

declare global {
  namespace Express {
    interface Request {
      validated?: ValidatedRequestData
    }
  }
}

function formatErrors(scope: keyof Schemas, error: ZodError) {
  return error.issues.map(issue => ({
    field: issue.path.length ? issue.path.join('.') : scope,
    message: issue.message,
  }))
}

export function validate(schemas: Schemas): RequestHandler {
  return (req, _res, next) => {
    const bodyResult = schemas.body?.safeParse(req.body)
    const paramsResult = schemas.params?.safeParse(req.params)
    const queryResult = schemas.query?.safeParse(req.query)

    if (bodyResult && !bodyResult.success) {
      return next(badRequest('Некорректное тело запроса', formatErrors('body', bodyResult.error)))
    }

    if (paramsResult && !paramsResult.success) {
      return next(badRequest('Некорректные параметры', formatErrors('params', paramsResult.error)))
    }

    if (queryResult && !queryResult.success) {
      return next(badRequest('Некорректный query', formatErrors('query', queryResult.error)))
    }

    req.validated = {
      ...(bodyResult?.success && {
        body: bodyResult.data,
      }),

      ...(paramsResult?.success && {
        params: paramsResult.data,
      }),

      ...(queryResult?.success && {
        query: queryResult.data,
      }),
    }

    next()
  }
}
