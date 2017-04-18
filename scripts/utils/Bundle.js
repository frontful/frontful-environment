import webpack from 'webpack'

process.noDeprecation = true

export default class Bundle {
  constructor(options) {
    this.options = options
    this.options.watch = this.options.watch || {
      aggregateTimeout: 300
    }
    this.compiler = webpack(this.options.config)
    this.compiler.outputFileSystem = this.options.fs || this.compiler.outputFileSystem
    this.compiled = false
    this.watcher = null
  }

  build() {
    return new Promise((resolve, reject) => {
      this.compiler.watch(this.options.watch, (error, stats) => {
        if (stats.hasErrors()) {
          reject(new Error(stats.toString()))
        }
        else {
          resolve(stats)
        }
      })
    })
  }

  watch(start, end) {
    return new Promise((resolve) => {
      this.compiler.plugin("watch-run", (compiler, next) => {
        start()
        next()
      })

      this.compiler.plugin("invalid", () => {
        start()
      })

      this.watcher = this.compiler.watch(this.options.watch, (error, stats) => {
        if (stats.hasErrors()) {
          end(stats)
        }
        else {
          end(stats)
          if (!this.compiled) {
            this.compiled = true
            resolve(stats)
          }
        }
      })
    })
  }

  rebuild() {
    if (this.compiled) {
      this.watcher.invalidate(() => {})
    }
  }
}
