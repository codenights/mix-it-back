import Nedb from 'nedb'

import { Party } from './party'
import logger from '../core/logger'

type PartyModel = Exclude<Party, 'id'> & { _id: string }

const fromInfra = (model: PartyModel): Party => ({
  id: model._id,
  playlist: model.playlist
})

export interface PartyRepository {
  create(party: Partial<Party>): Promise<Party>
  addSong(id: string, song: string): Promise<Party>
  removeAll(): Promise<void>
}

interface NedbPartyRepositoryOpts {
  db: Nedb
}

class NedbPartyRepository implements PartyRepository {
  private db: Nedb

  constructor({ db }: NedbPartyRepositoryOpts) {
    this.db = db
  }

  async create(party: Party): Promise<Party> {
    return new Promise((resolve, reject) => {
      this.db.insert(party, (err: Error, data: PartyModel) => {
        if (err) return reject(err)
        resolve(fromInfra(data))
      })
    })
  }

  async addSong(id: string, song: string): Promise<Party> {
    logger.debug(`Adding song ${song} to the party ${id}`)
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        {
          $addToSet: { playlist: song }
        },
        {},
        (updateError: Error) => {
          if (updateError) return reject(updateError)

          this.db.findOne({ _id: id }, (findOneError: Error, doc: PartyModel) => {
            if (findOneError) return reject(findOneError)
            return resolve(fromInfra(doc))
          })
        }
      )
    })
  }

  removeAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.remove({}, (err: Error, n: number) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

const db = new Nedb()
export function createPartyRepository(): PartyRepository {
  return new NedbPartyRepository({ db })
}

export default createPartyRepository
