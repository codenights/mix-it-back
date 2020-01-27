import { Socket } from 'socket.io'

import { Song } from './song'
import { Party } from './party'
import logger from '../core/logger'

export interface UserOptions {
  socket: Socket
  party: Party
}

export interface User {
  isOwner(): boolean
  onSubmitSong(song: Song): void
  onDisconnect(): void
}

class Guest implements User {
  private socket: Socket
  private party: Party

  constructor({ socket, party }: UserOptions) {
    this.socket = socket
    this.party = party
    logger.debug(`User connected on socket ${socket.id}`)
  }

  isOwner(): boolean {
    return false
  }

  onSubmitSong(song: Song): void {
    this.party.addSong(song)
  }

  onDisconnect(): void {
    logger.debug(`User disconnected from socket ${this.socket.id}`)
  }
}

// export class Owner implements User {}

export function createUser(opts: UserOptions): User {
  return new Guest(opts)
}

export default createUser
