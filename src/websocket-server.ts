import io, { Server } from 'socket.io'
import logger from './core/logger'

export function createWebsocketServer(): Server {
  const server = io(3000)
  server.on('connection', socket => {
    logger.debug(`Socket ${socket.id} connected`)
  })
  return server
}

export default createWebsocketServer
