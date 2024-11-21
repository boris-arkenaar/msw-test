import { ws, http, HttpResponse } from 'msw'

let mock = {
  data: 'test',
}

const socket = ws.link('ws://*/ws-test')

export const handlers = [
  http.get('/api/endpoint', async () => {
    return HttpResponse.json(mock)
  }),
  http.put('/mock/endpoint', async ({ request }) => {
    mock = await request.json()
    return new HttpResponse(null, { status: 204 })
  }),
  socket.addEventListener('connection', ({ client }) => {
    console.debug('connecting to server', client.url)
  }),
]
