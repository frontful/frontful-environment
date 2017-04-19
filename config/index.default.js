module.exports = {
  server: {
    index: './src/server/index.js',
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
