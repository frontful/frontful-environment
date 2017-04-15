const path = require('path')

module.exports = function fsRequire(fs, filename) {
  var content = fs.readFileSync(filename, 'utf8')
  var Module = module.constructor
  var _module = new Module()
  const paths = module.paths.slice()
  paths.unshift(path.resolve(process.cwd(), 'node_modules'))
  _module.paths = paths
  _module._compile(content, filename)
  return _module.exports
}
