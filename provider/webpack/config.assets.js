module.exports = function provider(options) {
  options = Object.assign({
    debug: false
  }, options)

  return {
    debug: options.debug,
    assets: {
      img: {
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'svg'],
      }
    }
  }
}
