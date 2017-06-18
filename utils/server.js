const chalk = require('chalk')
const fsAssetHandler = require('./fsAssetHandler')
const http = require('http')
const parseError = require('./parseError')

global.frontful = global.frontful || {}
global.frontful.environment = global.frontful.environment || {}
global.frontful.environment.parseError = parseError
global.frontful.environment.errorHandler = (error, req, res, next) => { // eslint-disable-line
  const parsed = parseError(error)
  console.log(parsed.color)
  res.send(`<pre>${parsed}</pre>`).end()
}

module.exports = function (handler, options) {
  options = options || {}

  let cumulativeHandler

  if (options.assets) {
    cumulativeHandler = (req, res) => {
      fsAssetHandler(options.fs, req, res, () => {
        handler(req, res)
      })
    }
  }
  else {
    cumulativeHandler = handler
  }

  const server = http.createServer(cumulativeHandler)

  const listener = server.listen(process.env.PORT || 80, (error) => {
    console[error ? 'error' : 'log'](error || chalk.green(`Server started on port ${process.env.PORT}`))
  })

  global.frontful.environment.server = server
  global.frontful.environment.listener = listener

  return server
}
