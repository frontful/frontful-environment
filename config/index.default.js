module.exports = {
  memory: true,
  server: {
    index: './src/server/index.js',
    assets: true,
    port: 8000,
    webpack: {
      // Options that will be passed to `./provider/webpack/server`
      options: null,
      // Raw Webpack configuration for server
      config: null,
    },
  },
  browser: {
    index: './src/browser/index.js',
    webpack: {
      // Options that will be passed to `./provider/webpack/browser`
      options: null,
      // Raw Webpack configuration for browser
      config: null,
    },
  },
}
