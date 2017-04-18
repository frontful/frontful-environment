const config = require('../config')
const fileSystem = require('fs')
const parse = require('url').parse
const resolve = require('path').resolve

function sendAsset(fs, url, res, environment = 'browser') {
  try {
    const pathPublic = config.webpack[environment].output.publicPath
    const path = config.webpack[environment].output.path

    if (url.pathname.indexOf(pathPublic) === 0) {
      const filename = resolve(path, url.pathname.replace(pathPublic, ''))
      var content = fs.readFileSync(filename);
      res.statusCode = 200
      res.end(content)
      return true
    }
  }
  catch(e) {
    console.log(e)
  }

  return false
}

module.exports = function fsAssetHandler(fs, req, res, next) {
  try {
    fs = fs || fileSystem
    const url = parse(req.url)
    const isAssetSent = sendAsset(fs, url, res, 'browser')
    if (!isAssetSent) {
      next()
    }
  }
  catch(e) {
    next()
  }
}
