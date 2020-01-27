import { Socket } from 'socket.io'

import { PartyRepository } from '../party-repository'

export interface Context<T> {
  event: string
  socket: Socket
  data: T
}

export interface PartyController {
  addSong(ctx: Context<string>): Promise<void>
}

export default function createPartyController(partyRepository: PartyRepository): PartyController {
  return {
    async addSong(ctx: Context<string>): Promise<void> {
      await partyRepository.update({
        _id: ctx.data.id
      })
    }
  }
}
