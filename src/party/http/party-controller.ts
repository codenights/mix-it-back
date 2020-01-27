import { Middleware } from '@koa/router'
import { constants } from 'http2'
import { PartyRepository } from '../party-repository'

export interface PartyController {
  create: Middleware
}

export default function createPartyController(partyRepository: PartyRepository): PartyController {
  return {
    /**
     * POST /parties
     * @param ctx
     */
    async create(ctx): Promise<void> {
      const body = ctx.request.body
      const party = await partyRepository.create(body)
      ctx.status = constants.HTTP_STATUS_CREATED
      ctx.body = party
      ctx.set('Location', `/parties/${party.id}`)
    }
  }
}
