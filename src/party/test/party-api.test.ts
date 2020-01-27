import request from 'supertest'

import { createTestServer, Server } from '../../http-server'

describe('Integration | API | Host', () => {
  let app: Server

  beforeAll(() => {
    app = createTestServer()
  })

  describe('POST /parties', () => {
    it('should return 201 Created', async () => {
      const { body, status, type } = await request(app)
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
