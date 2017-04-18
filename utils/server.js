const chalk = require('chalk')
const fsAssetHandler = require('./fsAssetHandler')
const http = require('http')

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
    console[error ? 'error' : 'log'](error || chalk.bold.green(`Server started on port ${process.env.PORT}`))
  })

  global.frontful = global.frontful || {}
  global.frontful.enviroment = global.frontful.enviroment || {}
  global.frontful.enviroment.server = server
  global.frontful.enviroment.listener = listener

  return server
}
