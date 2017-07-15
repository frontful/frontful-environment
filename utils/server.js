const chalk = require('chalk')
const getAssetHandler = require('./getAssetHandler')
const http = require('http')
const errorParser = require('./errorParser')
const getErrorHandler = require('./getErrorHandler')

global.frontful = global.frontful || {}
global.frontful.environment = global.frontful.environment || {}

global.frontful.environment.error = global.frontful.environment.error || {}
global.frontful.environment.error.parser = errorParser
global.frontful.environment.error.getHandler = getErrorHandler

module.exports = function (handler, options) {
  options = options || {}

  let cumulativeHandler

  if (options.assets) {
    const assetHandler = getAssetHandler({fs: options.fs})
    cumulativeHandler = (req, res) => {
      assetHandler(req, res, () => {
        handler(req, res)
      })
    }
  }
  else {
    cumulativeHandler = handler
  }

  const server = http.createServer(cumulativeHandler)

  process.env.PORT = process.env.PORT || 80

  const listener = server.listen(process.env.PORT, (error) => {
    console[error ? 'error' : 'log'](error || chalk.green(`Server started on port ${process.env.PORT}`))
  })

  global.frontful.environment.server = server
  global.frontful.environment.listener = listener

  return server
}
