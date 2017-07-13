const compression = require('compression')
const config = require('../config')
const fileSystem = require('fs')
const mime = require('mime')
const parse = require('url').parse
const resolve = require('path').resolve

const compressor = compression()

function sendAsset(fs, url, req, res, environment = 'browser') {
  try {
    const pathPublic = config[environment].webpack.output.publicPath
    const path = config[environment].webpack.output.path

    if (url.pathname.indexOf(pathPublic) === 0) {
      const filename = resolve(path, url.pathname.replace(pathPublic, ''))
      var content = fs.readFileSync(filename)
      compressor(req, res, () => {})
      res.setHeader("Content-Type", mime.lookup(filename))
      res.statusCode = 200
      res.end(content)
      return true
    }
  }
  catch(error) {}

  return false
}

module.exports = function fsAssetHandler(fs, req, res, next) {
  try {
    fs = fs || fileSystem
    const url = parse(req.url)
    const isAssetSent = sendAsset(fs, url, req, res, 'browser')
    if (!isAssetSent) {
      next()
    }
  }
  catch(e) {
    next()
  }
}
