import Router from '@koa/router'
import compose from 'koa-compose'

import createPartyController from './party-controller'
import createPartyRepository from '../party-repository'

const partyRepository = createPartyRepository()
const partyController = createPartyController(partyRepository)
const partyRouter = new Router().post('/parties', partyController.create)

export default compose([partyRouter.routes(), partyRouter.allowedMethods()])
