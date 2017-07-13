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
  if (!res.headersSent) {
    res.status(500)
    if (req.accepts('html')) {
      res.send(`<pre style="color: red;">${parsed}</pre>`).end()
    }
    else if (req.accepts('json')) {
      res.json({error: parsed.toString()}).end()
    }
    else {
      res.send(parsed.toString()).end()
    }
  }
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

  process.env.PORT = process.env.PORT || 80

  const listener = server.listen(process.env.PORT, (error) => {
    console[error ? 'error' : 'log'](error || chalk.green(`Server started on port ${process.env.PORT}`))
  })

  global.frontful.environment.server = server
  global.frontful.environment.listener = listener

  return server
}
