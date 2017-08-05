const errorParser = require('./errorParser')

module.exports = function getErrorHandler(options) {
  options = Object.assign({
    details: true,
  }, options)

  return function errorHandler(error, req, res, next) {
    error = errorParser(error)

    console.log(error.colorful)
    if (!res.headersSent) {
      res.status(500)
      if (options.details) {
        if (req.accepts('html')) {
          res.send(`<pre style="color: red;">${error.string}</pre>`)
        }
        else if (req.accepts('json')) {
          res.json({error: error.details})
        }
        else {
          res.send(error.string)
        }
      }
      else {
        res.end()
      }
    }
    else {
      next()
    }
  }
}
