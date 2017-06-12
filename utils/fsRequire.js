const fileSystem = require('fs')
const requireFromString = require('require-from-string')

module.exports = function fsRequire(fs, filename) {
  fs = fs || fileSystem
  var content = fs.readFileSync(filename, 'utf8')
  return requireFromString(content, filename)
}
