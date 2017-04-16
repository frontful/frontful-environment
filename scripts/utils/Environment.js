import Bundle from './Bundle'
import MemoryFS from 'memory-fs'
import ModuleReloader from './ModuleReloader'
import chalk from 'chalk'
import config from '../../config'
import createAssetHandler from '../../utils/createAssetHandler'
import deferred from '../../utils/deferred'
import fsRequire from '../../utils/fsRequire'
import http from 'http'
import path from 'path'

process.env.PORT = config.port

export default class Environment {
  constructor() {
    this.fs = new MemoryFS()

    this.options = {
      stats: {
        children: false,
        chunkModules: false,
        chunks: false,
        colors: true,
        hash: false,
        modules: false,
        timings: false,
        version: false,
      },
    }

    this.server = {
      bundle: new Bundle({
        config: config.webpack.server,
        fs: this.fs,
      }),
      filename: null,
      requestHandler: null,
      httpServer: null,
      compile: null,
      stats: null,
    }

    this.browser = {
      bundle: new Bundle({
        config: config.webpack.browser,
        fs: this.fs,
      }),
      compile: null,
      stats: null,
    }

    this.compiled = false
    this.compile = null
  }

  startHandler(bundle) {
    if (this[bundle].compile) {
      this[bundle].compile.reject()
    }
    this[bundle].compile = deferred()

    if (this.server.compile && this.browser.compile) {
      if (this.compile) {
        this.compile.reject()
      }
      this.compile = deferred()
      this[bundle].compile.promise.then(this.compile.resolve).catch(() => {})

      Promise.all([this.server.compile.promise, this.browser.compile.promise, this.compile.promise]).then((stats) => {
        const {0: serverStats, 1: browserStats} = stats

        if (serverStats.hasErrors() && (!this.browser.stats || !this.browser.stats.hasErrors())) {
          console.log(serverStats.toString({...this.options.stats, assets: false}))
        }
        else if (browserStats.hasErrors() && (!this.server.stats || !this.server.stats.hasErrors())) {
          console.log(browserStats.toString({...this.options.stats, assets: false}))
        }
        else {
          if (this.compiled) {
            console.log(chalk.gray(`Application rebuilt`))
            this.server.requestHandler = fsRequire(this.fs, this.server.filename)
          }
        }

        this.server.stats = serverStats
        this.browser.stats = browserStats
      }).catch((e) => e ? console.log(e) : null)
    }
  }

  endHandler(bundle, stats) {
    this[bundle].compile.resolve(stats)
  }

  run() {
    Promise.all([
      this.server.bundle.run(
        this.startHandler.bind(this, 'server'),
        this.endHandler.bind(this, 'server')
      ),
      this.browser.bundle.run(
        this.startHandler.bind(this, 'browser'),
        this.endHandler.bind(this, 'browser')
      ),
    ]).then((stats) => {
      console.log(stats[1].toString(this.options.stats))
      console.log(chalk.bold.green(`Application built`))

      this.server.filename = path.resolve(config.webpack.server.output.path, stats[0].compilation.entrypoints.index.chunks[0].files[0])

      this.server.requestHandler = fsRequire(this.fs, this.server.filename)
      const assetHandler = createAssetHandler(this.fs)

      this.server.httpServer = http.createServer((req, res) => {
        assetHandler(req, res, () => {
          this.server.requestHandler(req, res)
        })
      })

      this.server.httpServer.listen(process.env.PORT, (error) => {
        console[error ? 'error' : 'log'](error || chalk.bold.green(`Server started on port ${process.env.PORT}`))
      })
    }).then(() => {
      this.compiled = true
      new ModuleReloader().run()
    }).catch((e) => console.log(e))
  }
}
