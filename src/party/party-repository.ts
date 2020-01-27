import Nedb from 'nedb'

import { Party } from './party'
import logger from '../core/logger'

export interface PartyRepository {
  create(party: Party): Promise<Party>
  addSong(id: string, song: string): Promise<Party>
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
      this.db.insert(party, (err: Error, data: Party) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  async addSong(id: string, song: string): Promise<Party> {
    logger.debug(`Adding song ${song} to the party ${id}`)
    return new Promise((resolve, reject) => {
      this.db.update(
        { id },
        {
          $addToSet: { song }
        },
        {},
        (updateError: Error) => {
          if (updateError) return reject(updateError)

          this.db.findOne({ _id: id }, (findOneError: Error, doc: Party) => {
            if (findOneError) return reject(findOneError)
            return resolve(doc)
          })
        }
      )
    })
  }
}

export function createPartyRepository(): PartyRepository {
  const db = new Nedb()
  return new NedbPartyRepository({ db })
}

export default createPartyRepository
