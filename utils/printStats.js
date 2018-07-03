const chalk = require('chalk')
const pad = require('pad')
const path = require('path')

const statsOptions = {
  children: false,
  chunkModules: false,
  chunks: false,
  assets: true,
  colors: true,
  hash: false,
  modules: false,
  timings: false,
  version: false,
}

module.exports = function printStats(printSize, items) {
  items = Array.isArray(items) ? items : [items]
  const stats = {
    time: null,
    folder: {}
  }

  const context = path.resolve(process.cwd(), 'build')
  const base = path.resolve(context, 'browser/assets')

  let maxSizeLength = 0
  let error = false

  items.forEach((item) => {
    if (!error) {
      if (item.hasErrors()) {
        error = true
        console.log(item.toString(Object.assign({}, statsOptions, {assets: false})))
      }
      else {
        const jsonStats = item.toJson(statsOptions)

        jsonStats.assets.forEach((asset) => {
          const filePath = path.resolve(base, asset.name)
          const file = path.basename(filePath)
          const size = `${(asset.size / 1024.0).toFixed(2)} kB`

          maxSizeLength = Math.max(maxSizeLength, size.length)

          const folder = '.' + filePath.replace(process.cwd(), '').replace(file, '').replace(/(\/|\\)$/,'');
          stats.folder[folder] = stats.folder[folder] || []

          stats.folder[folder].push({
            file: file,
            size: size,
          })
        })
      }
    }
  })

  if (!error) {
    console.log()
    Object.keys(stats.folder).forEach((folder) => {
      console.log(`${chalk.bold.white(folder)}`)
      const files = []
      stats.folder[folder].forEach((item) => {
        if (files.indexOf(item.file) === -1) {
          console.log(` ${printSize ? chalk.gray(pad(maxSizeLength, item.size) + ' ') : ''}${chalk.green(item.file)}`)
          files.push(item.file)
        }
      })
    })
  }

  console.log()
}
