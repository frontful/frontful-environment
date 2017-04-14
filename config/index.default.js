module.exports = {
  server: {
    script: './src/server/index.js',
  },
  browser: {
    webpack: {
      // `options` that will be passed to require('../provider/webpack')
      // when browser.webpack.config not specified
      options: {
        // one or more `entry` points,
        // will be resolved relative to process.cwd()
        entry: {
          main: './src/browser/index.js',
        },
      },
      // raw webpack config || `require('../provider/webpack')(/* options */)`
      config: null,
    },
  },
}
