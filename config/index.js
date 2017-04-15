const defaultConfig = require('./index.default')
const objectPath = require('object-path')

const hash = Math.random().toString(36).substr(2, 10)
const customConfig = objectPath({})

const mergedConfig = {
  webpack: {
    server: (
      customConfig.get('webpack.server.config') ||
      require('../provider/webpack/server')(
        customConfig.get('webpack.server.options') ||
        defaultConfig.webpack.server.options
      )
    ),
    browser: (
      customConfig.get('webpack.browser.config') ||
      require('../provider/webpack/browser')(
        customConfig.get('webpack.browser.options') ||
        defaultConfig.webpack.browser.options
      )
    ),
    hash: hash,
  },
}

module.exports = mergedConfig
