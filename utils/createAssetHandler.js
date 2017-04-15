import config from '../config'
import {parse} from 'url'
import {resolve} from 'path'

export default function createAssetHandler(fs) {
  function sendAsset(url, res, environment = 'browser') {
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
    catch(e) {}

    return false
  }

  return function assetHandler(req, res, next) {
    try {
      const url = parse(req.url)
      const isAssetSent = sendAsset(url, res, 'browser') || sendAsset(url, res, 'server')
      if (!isAssetSent) {
        next()
      }
    }
    catch(e) {
      next()
    }
  }
}
