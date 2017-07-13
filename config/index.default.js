module.exports = {
  memory: true,
  server: {
    index: './src/server/index.js',
    assets: true,
    port: 8000,
    webpack: {
      options: null,
      config: null,
    },
  },
  browser: {
    index: './src/browser/index.js',
    webpack: {
      options: null,
      config: null,
    },
  },
}
