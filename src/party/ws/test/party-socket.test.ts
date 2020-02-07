import { Namespace } from 'socket.io'
import client from 'socket.io-client'

import createPartyNamespace from '../party-router'
import createWebsocketServer from '../../../websocket-server'
import createPartyRepository from '../../party-repository'
import { Party } from '../../party'

describe('Integration | Socket | Party ', () => {
  let namespace: Namespace

  beforeAll(() => {
    const server = createWebsocketServer()
    namespace = createPartyNamespace(server)
  })

  it('connects to the namespace /party', done => {
    expect.assertions(3)
    const socket = client.connect('http://localhost:3000/party', {
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

  describe('song:submit', () => {
    let socket: SocketIOClient.Socket
    let party: Party

    beforeEach(async () => {
      party = await createPartyRepository().create({
        owner: null,
        host: null,
        playlist: []
      })
      socket = client.connect('http://localhost:3000/party', {
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
