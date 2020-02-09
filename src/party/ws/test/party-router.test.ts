import client from 'socket.io-client'

import createHttpServer from '../../../http-server'
import createWebsocketServer from '../../../websocket-server'
import createPartyRepository from '../../party-repository'
import { Party } from '../../party'
import getPort from 'get-port'
import createApp from '../../../app'

describe('Integration | Socket | Party ', () => {
  let port: number

  beforeAll(async () => {
    port = await getPort()
    const app = createApp({ port })
    await app.start()
  })

  describe('connects to the namespace /party', () => {
    it('joins the party if it exists', done => {
      expect.assertions(3)
      const socket = client.connect(`http://localhost:${port}/party`, {
        query: {
          clientType: 'host',
          partyId: 'uuid'
        }
      })
      socket.on('connect', () => {
        expect(socket).toBeDefined()
        expect(socket.connected).toBeTruthy()
        expect(socket.nsp).toBe('/party')
        done()
      })
    })

    it('throws an error if the party does not exist', done => {
      expect.assertions(3)
      const socket = client.connect(`http://localhost:${port}/party`, {
        query: {
          clientType: 'host',
          partyId: 'uuid'
        }
      })
      socket.on('connect', () => {
        expect(socket).toBeDefined()
        expect(socket.connected).toBeTruthy()
        expect(socket.nsp).toBe('/party')
        done()
      })
    })
  })

  describe.skip('join', () => {})

  describe('song:submit', () => {
    let socket: SocketIOClient.Socket
    let party: Party

    beforeEach(async () => {
      party = await createPartyRepository().create({
        playlist: []
      })
      socket = client.connect(`http://localhost:${port}/party`, {
        query: {
          clientType: 'host',
          partyId: party.id
        }
      })
    })

    it('emits a "playlist" event', done => {
      expect.assertions(1)
      socket.on('connect', () => {
        socket.on('playlist', (playlist: string[]) => {
          expect(playlist).toStrictEqual(['abc'])
          done()
        })
        socket.emit('song:submit', 'abc')
      })
    })
  })
})
