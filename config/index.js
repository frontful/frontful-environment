const defaultConfig = require('./index.default')
const objectPath = require('object-path')

const customConfig = objectPath({})

const mergedConfig = {
  server: {
    script: (
      customConfig.get('server.script') ||
      defaultConfig.server.script
    ),
  },
  browser: {
    webpack: (
      customConfig.get('browser.webpack.config') ||
      require('../provider/webpack')(
        customConfig.get('browser.webpack.options') ||
        defaultConfig.browser.webpack.options
      )
    ),
  },
}

module.exports = mergedConfig
