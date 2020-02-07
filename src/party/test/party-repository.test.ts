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
        host: 'host',
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        owner: 'owner',
        playlist: []
      }
      const actual = await partyRepository.create(party)
      expect(actual).toStrictEqual({
        id: expect.any(String),
        host: 'host',
        owner: 'owner',
        playlist: []
      })
    })
  })
})
