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
})
