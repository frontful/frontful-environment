module.exports = function resolve(item) {
  if (typeof item === 'string') {
    return require.resolve(item)
  }
  else {
    if (item instanceof Array) {
      item[0] = resolve(item[0])
    }
    return item
  }
}
