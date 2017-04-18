const path = require('path')
const fileSystem = require('fs')

module.exports = function fsRequire(fs, filename) {
  fs = fs || fileSystem

  const modulesPaths = module.paths.slice()
  modulesPaths.unshift(path.resolve(process.cwd(), 'node_modules'))

  var content = fs.readFileSync(filename, 'utf8')
  var Module = module.constructor
  var _module = new Module()

  _module.paths = modulesPaths
  _module._compile(content, filename)

  content = null

  return _module.exports
}
