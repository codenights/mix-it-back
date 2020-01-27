import express from 'express'
import compression from 'compression' // compresses requests
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import mongo from 'connect-mongo'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { MONGODB_URI } from './core/secrets'
// Controllers (route handlers)

const MongoStore = mongo(session)

// Create Express server
const app = express()
const server = app.listen(3000, () => {
  console.log('server running')
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io')(server, { origins: '*:*' })

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
    // process.exit();
  })

// Express configuration
app.use(cors({ origin: true }))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Primary app routes.
 */
app.get('/host', hostController.index)

const global = io.on('connection', function(socket: any) {
  console.log('a user connected')
  socket.emit('request', { hello: 'world' }) // emit an event to the socket
  socket.on('pingServer', (data: string) => {
    console.log('Client sent : ', data)
    setTimeout(() => socket.emit('pongClient', 'PONG'), 2000)
  })
})
io.of('/host').on('connection', (socketHost: any) => {
  console.log('Host connected')
  socketHost.on('addHost', (partyId: string) => {
    const room = hostController.partyList.get(partyId)
    room.host = socketHost
  })
})

interface RoomRequest {
  songId: string
  partyId: string
}
io.of('/room').on('connection', (socketRoom: any) => {
  console.log('Room connected')
  socketRoom.on('addSong', ({ songId, partyId }: RoomRequest) => {
    console.log(songId, partyId)
    const room = hostController.partyList.get(partyId)
    if (!room) {
      console.log("La party n'existe pas")
    } else {
      console.log(room)
      const existingSong = room.party.playlist.find(song => song === songId)
      if (!existingSong) room.party.playlist.push(songId)
      room.host.emit(partyId, room.party)
    }
  })
})

export default app
