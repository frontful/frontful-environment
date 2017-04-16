import chalk from 'chalk'
import chokidar from 'chokidar'
import config from '../../config'
import debouce from 'lodash.debounce'
import path from 'path'
import uniq from 'lodash.uniq'

process.preserveSymlinks = true

export default class ModuleReloader {
  constructor() {
    this.queue = []
    this.clearCache = debouce(this.clearCache, 300)
  }

  run() {
    this.watcher = chokidar.watch(config.modules, {
      cwd: path.resolve(process.cwd(), 'node_modules'),
      ignoreInitial: true,
      ignored: /node_modules.*node_modules/,
    })

    this.watcher.on('change', (path) => {
      const moduleName = path.split('/')[0]
      this.reload(moduleName)
    })
  }

  reload(moduleName) {
    if (moduleName) {
      this.queue.push(moduleName)
    }
    this.clearCache()
  }

  clearCache() {
    const queue = uniq(this.queue)
    this.queue = []

    Object.keys(require.cache).forEach(function(id) {
      for(let i = 0, l = queue.length; i < l; i++) {
        if (id.indexOf('node_modules/' + queue[i]) !== -1 && id.indexOf(queue[i] + '/node_modules') === -1) {
          delete require.cache[id]
          break
        }
      }
    })

    queue.forEach((moduleName) => {
      console.log(chalk.gray(`Module ${moduleName} reloaded`))
    })
  }
}
