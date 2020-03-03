import client from 'socket.io-client'

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

  it('connects to the namespace /parties', done => {
    expect.assertions(3)
    const socket = client.connect(`http://localhost:${port}/parties`)
    socket.on('connect', () => {
      expect(socket).toBeDefined()
      expect(socket.connected).toBeTruthy()
      expect(socket.nsp).toBe('/parties')
      done()
    })
  })

  describe('room:join', () => {
    let socket: SocketIOClient.Socket

    beforeEach(done => {
      socket = client.connect(`http://localhost:${port}/parties`)
      socket.on('connect', done)
    })

    it('acknowledges the room was joined', done => {
      socket.emit('room:join', { clientType: 'host', partyId: 'party' }, () => {
        done()
      })
    })

    it('emits an error if the party does not exist', done => {
      socket.emit('room:join', { clientType: 'host', partyId: 'non existing party' }, err => {
        expect(err).toBeInstanceOf(Error)
      })
    })
  })

  describe('song:submit', () => {
    let socket: SocketIOClient.Socket
    let party: Party

    beforeEach(async () => {
      party = await createPartyRepository().create({
        playlist: []
      })
      socket = client.connect(`http://localhost:${port}/parties`, {
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
