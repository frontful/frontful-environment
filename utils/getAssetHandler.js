const compression = require('compression')
const config = require('../config')
const fileSystem = require('fs')
const mime = require('mime')
const parse = require('url').parse
const resolve = require('path').resolve

const compressor = compression()

module.exports = function getAssetHandler(options) {
  options = Object.assign({}, options)
  options.fs = (options && options.fs) || fileSystem

  return function assetHandler(req, res, next) {
    try {
      const url = parse(req.url)
      const pathPublic = config['browser'].webpack.output.publicPath
      const path = config['browser'].webpack.output.path

      if (url.pathname.indexOf(pathPublic) === 0) {
        const filename = resolve(path, url.pathname.replace(pathPublic, ''))
        var content = options.fs.readFileSync(filename)
        compressor(req, res, () => {})
        res.setHeader("Content-Type", mime.getType(filename))
        res.statusCode = 200
        res.end(content)
      }
      else {
        next()
      }
    }
    catch(error) {
      console.log(error)
      next()
    }
  }
}
