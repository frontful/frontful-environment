const requireFromString = require('require-from-string')

module.exports = function requireFile(filename, options) {
  if (options && options.fs) {
    var content = options.fs.readFileSync(filename, 'utf8')
    return requireFromString(content, filename)
  }
  else {
    return require(filename)
  }
}
