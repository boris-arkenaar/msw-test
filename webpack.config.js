const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { ws, http, HttpResponse } = require("msw");
const { setupServer } = require("msw/node");

let mock = {
  data: "test",
};

const socket = ws.link("ws://localhost:8080/ws-test");
const handlers = [
  http.get("http://localhost:8080/endpoint", async () => {
    return new HttpResponse(JSON.stringify(mock));
  }),
  http.put("http://localhost:8080/mock/endpoint", async ({ request }) => {
    mock = await request.json();

    return new HttpResponse(null, {
      status: 204,
    });
  }),
  socket.addEventListener("connection", ({ client }) => {
    console.debug("connecting to server", client.url);
  }),
];
const server = setupServer(...handlers);
server.listen();

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  devServer: {
    open: false,
    port: 3000,
    static: "./dist",
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use(
        createProxyMiddleware({
          pathFilter: "/ws-test",
          target: "ws://localhost:8080",
          ws: true,
          changeOrigin: true,
        }),
      );
      devServer.app.use(
        "/api",
        createProxyMiddleware({
          target: "http://localhost:8080",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "",
          },
        }),
      );
      return middlewares;
    },
  },
};
