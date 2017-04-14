module.exports = function hash() {
  return Math.random().toString(36).substr(2, 10)
}
