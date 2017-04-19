import path from 'path'
import chalk from 'chalk'
import pad from 'pad'

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

export default function printStats(printSize, ...items) {
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
        console.log(item.toString({...statsOptions, assets: false}))
      }
      else {
        const jsonStats = item.toJson(statsOptions)

        jsonStats.assets.forEach((asset) => {
          const filePath = path.resolve(base, asset.name)
          const file = path.basename(filePath)
          const size = `${(asset.size / 1024.0).toFixed(2)} kB`

          maxSizeLength = Math.max(maxSizeLength, size.length)

          const folder = '.' + filePath.replace(process.cwd(), '').replace(`/${file}`, '')
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
      stats.folder[folder].forEach((item) => {
        console.log(` ${printSize ? chalk.gray(pad(maxSizeLength, item.size) + ' ') : ''}${chalk.green(item.file)}`)
      })
    })
  }

  console.log()
}
