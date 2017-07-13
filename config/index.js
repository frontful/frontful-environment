const defaultConfig = require('./index.default')
const objectPath = require('object-path')
const providerPackage = require('frontful-config/provider/package')

const customConfig = objectPath(providerPackage('frontful.environment') || {})

const serverWebpackOptions = customConfig.get('server.webpack.options') || defaultConfig.server.webpack.options || {}
serverWebpackOptions.index = (serverWebpackOptions && serverWebpackOptions.index) || customConfig.get('server.index') || defaultConfig.server.index

const browserWebpackOptions = customConfig.get('browser.webpack.options') || defaultConfig.browser.webpack.options || {}
browserWebpackOptions.index = (browserWebpackOptions && browserWebpackOptions.index) || customConfig.get('browser.index') || defaultConfig.browser.index

const mergedConfig = {
  memory: typeof customConfig.get('memory') === 'boolean' ? customConfig.get('memory') : defaultConfig.memory,
  server: {
    index: serverWebpackOptions.index,
    assets: typeof customConfig.get('server.assets') === 'boolean' ? customConfig.get('server.assets') : defaultConfig.server.assets,
    port: customConfig.get('server.port') || defaultConfig.server.port,
    webpack: customConfig.get('server.webpack.config') || require('../provider/webpack/server')(serverWebpackOptions),
  },
  browser: {
    index: browserWebpackOptions.index,
    webpack: customConfig.get('browser.webpack.config') || require('../provider/webpack/browser')(browserWebpackOptions),
  },
}

module.exports = mergedConfig
