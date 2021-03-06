import createPartyRepository, { PartyRepository } from '../party-repository'
import { Party } from '../party'

describe('Integration | Repository | Party', () => {
  let partyRepository: PartyRepository

  beforeEach(() => {
    partyRepository = createPartyRepository()
  })

  it('exists', () => {
    expect(partyRepository).toBeDefined()
  })

  describe('#create', () => {
    it('creates a party', async () => {
      const party: Party = {
        playlist: []
      }
      const actual = await partyRepository.create(party)
      expect(actual).toStrictEqual({
        id: expect.any(String),
        playlist: []
      })
    })
  })

  describe('#get', () => {
    it('gets a party', async () => {
      const expected = await partyRepository.create({
        playlist: ['abc']
      })
      const actual = await partyRepository.get(expected.id)
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('#addSong', () => {
    it('adds a song to the playlist', async () => {
      const party = await partyRepository.create({
        playlist: []
      })
      const actual = await partyRepository.addSong(party.id, 'song')
      expect(actual).toStrictEqual({
        id: party.id,
        playlist: ['song']
      })
    })
  })

  describe('#unshiftPlaylist', () => {
    it('unshifts a song from a playlist', async () => {
      const expected = await partyRepository.create({
        playlist: ['abc', 'def']
      })
      const actual = await partyRepository.unshiftPlaylist(expected.id)
      expect(actual).toStrictEqual({
        id: expected.id,
        playlist: ['def']
      })
    })
  })

  describe('#removeAll', () => {
    it('removes all the parties', async () => {
      await partyRepository.removeAll()
      // TODO: count or findAll to prove that there is no more party
    })
  })
})
