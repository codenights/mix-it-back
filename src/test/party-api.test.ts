import getPort from 'get-port'
import { Server as HttpServer } from 'http'
import { Http2Server } from 'http2'
import request from 'supertest'

import createApp from '../app'

describe('Integration | API | Host', () => {
  let server: HttpServer | Http2Server

  beforeAll(async () => {
    const port = await getPort()
    server = createApp({ port }).http
  })

  describe('POST /parties', () => {
    it('should return 201 Created', async () => {
      const { body, status, type } = await request(server)
        .post('/parties')
        .set('Content-Type', 'application/json')
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.any(String),
        playlist: []
      })
    })
  })
})
