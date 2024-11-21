import { Client } from '@stomp/stompjs'

let stompClient

function component() {
  const element = document.createElement('div')
  const endpointButton = document.createElement('button')
  const startButton = document.createElement('button')
  const stopButton = document.createElement('button')

  endpointButton.innerHTML = 'Endpoint'
  endpointButton.onclick = async () => {
    try {
      const response = await fetch('/api/endpoint')
      const data = await response.json()
      console.log(response.status, data)
    } catch (error) {
      console.error(error)
    }
  }

  startButton.innerHTML = 'Start WebSocket'
  startButton.onclick = async () => {
    if (stompClient) {
      return
    }

    stompClient = new Client({
      brokerURL: 'ws://localhost:3000/ws-test',
      onConnect: () =>
        stompClient?.subscribe(`/topic/test`, ({ body }) =>
          console.log('Received:', body),
        ),
      reconnectDelay: 1,
      connectionTimeout: 10000,
    })

    stompClient.activate()
  }

  stopButton.innerHTML = 'Stop WebSocket'
  stopButton.onclick = async () => {
    stompClient?.deactivate().then(() => {
      stompClient = undefined
    })
  }

  element.appendChild(endpointButton)
  element.appendChild(startButton)
  element.appendChild(stopButton)

  return element
}

async function enableMocking() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }
}

enableMocking().then(() => {
  document.body.appendChild(component())
})
