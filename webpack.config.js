const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    open: false,
    port: 3000,
    static: './dist',
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use(
        createProxyMiddleware({
          pathFilter: '/ws-test',
          target: 'ws://localhost:8080',
          ws: true,
          changeOrigin: true,
        }),
      )
      devServer.app.use(
        '/api',
        createProxyMiddleware({
          target: 'http://localhost:8080',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
        }),
      )
      return middlewares
    },
  },
}
