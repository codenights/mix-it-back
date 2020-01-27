import { User } from './user'
import { Playlist } from './playlist'

export interface Party {
  id?: string
  host: any
  owner: User
  playlist: Playlist
}
