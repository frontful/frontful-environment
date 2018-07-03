module.exports = function (assetsByChunkName) {
  assetsByChunkName.main = (assetsByChunkName.main instanceof Array) ? assetsByChunkName.main : [assetsByChunkName.main]
  assetsByChunkName.vendor = (assetsByChunkName.vendor instanceof Array) ? assetsByChunkName.vendor : [assetsByChunkName.vendor]

  const bundle = {
    js: {
      main: `/assets/${assetsByChunkName.main.find((fileName) => /\.main\.js$/gi.test(fileName))}`,
      vendor: `/assets/${assetsByChunkName.vendor.find((fileName) => /\.vendor\.js$/gi.test(fileName))}`,
    },
    css: {
      main: `/assets/${assetsByChunkName.main.find((fileName) => /\.main\.css$/gi.test(fileName))}`,
    }
  }

  global.frontful = global.frontful || {}
  global.frontful.environment = global.frontful.environment || {}

  global.frontful.environment.bundle = bundle
}
