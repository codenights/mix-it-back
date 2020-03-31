import joi, { Schema } from '@hapi/joi'
import { mock } from 'jest-mock-extended'
import { Context, Next } from 'koa'

import validate from '../validator'

describe('Unit | Core | Validator', () => {
  let ctx: Context
  let next: Next

  beforeEach(() => {
    ctx = mock<Context>({
      query: {},
      body: {},
      params: {},
      headers: {},
      throw: jest.fn() as never
    })
    next = jest.fn()
  })

  it('passes if no schema is given', async () => {
    const schema = {}
    await validate(schema)(ctx, next)
    expect(next).toHaveBeenCalled()
  })

  describe('Query', () => {
    it('validates the query parameters', async () => {
      const query: Schema = joi.object({
        limit: joi.number(),
        page: joi.number()
      })
      await validate({ query })(ctx, next)
      expect(next).toHaveBeenCalled()
    })

    it('ignores additional query parameters', async () => {
      const query: Schema = joi.object({
        limit: joi.number(),
        page: joi.number()
      })
      ctx.query = {
        additionalParameter: 123
      }
      await validate({ query })(ctx, next)
      expect(next).toHaveBeenCalled()
      expect(ctx.query).toStrictEqual({
        additionalParameter: 123
      })
    })

    it('fails if some mandatory query parameters are not given', async () => {
      const query: Schema = joi.object({
        limit: joi.number().required(),
        page: joi.number()
      })
      await validate({ query })(ctx, next)
      expect(ctx.throw).toHaveBeenCalled()
    })
  })

  describe('Body', () => {
    it('validates the request body', async () => {
      const query: Schema = joi.object({
        limit: joi.number(),
        page: joi.number()
      })
      await validate({ query })(ctx, next)
      expect(next).toHaveBeenCalled()
    })

    it('removes the extra keys', async () => {
      const body: Schema = joi.object({
        key1: joi.string(),
        key2: joi.number()
      })
      ctx.request.body = {
        key1: 'string',
        key2: 123,
        key3: 'to be stripped'
      }
      await validate({ body })(ctx, next)
      expect(next).toHaveBeenCalled()
      expect(ctx.request.body).toStrictEqual({
        key1: 'string',
        key2: 123
      })
    })

    it('fails if some mandatory keys are not given', async () => {
      const body: Schema = joi.object({
        key1: joi.number().required(),
        key2: joi.number()
      })
      ctx.request.body = {
        key2: 123
      }
      await validate({ body })(ctx, next)
      expect(ctx.throw).toHaveBeenCalled()
    })
  })
})
