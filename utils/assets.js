module.exports = function (assetsByChunkName) {
  assetsByChunkName.main = (assetsByChunkName.main instanceof Array) ? assetsByChunkName.main : [assetsByChunkName.main]
  assetsByChunkName.vendor = (assetsByChunkName.vendor instanceof Array) ? assetsByChunkName.vendor : [assetsByChunkName.vendor]

  const assets = {
    js: {
      main: assetsByChunkName.main[0] && `/assets/${assetsByChunkName.main[0]}`,
      vendor: assetsByChunkName.vendor[0] && `/assets/${assetsByChunkName.vendor[0]}`,
    },
    css: {
      main: assetsByChunkName.main[1] && `/assets/${assetsByChunkName.main[1]}`,
      vendor: assetsByChunkName.vendor[1] && `/assets/${assetsByChunkName.vendor[1]}`,
    }
  }

  global.frontful = global.frontful || {}
  global.frontful.environment = global.frontful.environment || {}
  global.frontful.environment.assets = assets
}
