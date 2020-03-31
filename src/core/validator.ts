import { Schema, ValidationOptions } from '@hapi/joi'
import { Context, Middleware, Next } from 'koa'

interface Validatable {
  query?: Schema
  path?: Schema
  body?: Schema
  headers?: Schema
}

function validateObject(obj: object, schema?: Schema, opts?: ValidationOptions) {
  if (schema) {
    const { error, value } = schema.validate(obj, opts)
    if (error) {
      throw error
    }
    return value
  }
  return obj
}

export function validate<T>(validatable: Validatable): Middleware<T> {
  return async (ctx: Context, next: Next) => {
    try {
      ctx.query = validateObject(ctx.query, validatable.query, { allowUnknown: true })
      ctx.request.body = validateObject(ctx.request.body, validatable.body, { stripUnknown: true })
      ctx.request.headers = validateObject(ctx.request.headers, validatable.headers, { allowUnknown: true })
      await next()
    } catch (err) {
      ctx.throw(400, err.message)
    }
  }
}
