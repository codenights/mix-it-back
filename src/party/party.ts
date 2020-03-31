import { Playlist } from './playlist'

export interface Party {
  id?: string
  owner: string
  playlist: Playlist
}
