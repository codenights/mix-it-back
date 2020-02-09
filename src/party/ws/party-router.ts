import { Namespace, Server, Socket } from 'socket.io'

import logger from '../../core/logger'
import createPartyRepository, { PartyRepository } from '../party-repository'
import { Party } from '../party'

interface Context<T> {
  event: string
  socket: Socket
  data: T
}

const partyRepository: PartyRepository = createPartyRepository()

export function createPartyNamespace(server: Server): Namespace {
  return server.of('/party').on('connection', (socket: Socket) => {
    const { clientType, partyId } = socket.handshake.query
    logger.debug(`User with socket ${socket.id} connected ; clientType = ${clientType} ; partyId = ${partyId}`)

    // Join the room
    socket.join(partyId, err => {
      if (err) throw err
      logger.debug(`User with ${socket.id} joined the party ${partyId}`)
    })

    socket.on('song:submit', async (song: string) => {
      const party: Party = await partyRepository.addSong(partyId, song)
      logger.info(`Added song ${song} to the party ${partyId}`)
      socket.emit('playlist', party.playlist)
    })

    // When a user disconnects
    socket.on('disconnect', () => {
      logger.debug(`User with socket ${socket.id} disconnected`)
    })
  })
}

export default createPartyNamespace
