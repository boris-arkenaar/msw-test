# Testing MSW with websocket

## Running locally

- Clone the project and run `pnpm install`.
- Then run `pnpm run start` to start the server.
- Open the browser and go to `http://localhost:3000`.

## Test API endpoint

- In the browser, click on the 'Endpoint' button.
- In the browser's console, you should see `200 {data: 'test'}`.

## Test changing mocked response on the fly

- In the browser, click on the 'Endpoint' button.
- In the browser's console, you should see `200 {data: 'test'}`.
- Run the following command in your terminal:

```bash
curl --location --request PUT 'http://localhost:3000/api/mock/endpoint' \
--header 'Content-Type: application/json' \
--data '{
    "data": "mock"
}'
```

- Go back to the browser, click on the 'Endpoint' button.
- This time in the browser's console, you should see `200 {data: 'mock'}`.

## Test websocket

- In the browser, click on the 'Start WebSocket' button.
- In the browser's console you will see `WebSocket connection to 'ws://localhost:3000/ws-test' failed`
- In the terminal you will see:

```
[MSW] Warning: intercepted a request without a matching request handler:

  • GET http://localhost:8080/ws-test

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks
```
