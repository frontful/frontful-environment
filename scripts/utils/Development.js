import Bundle from './Bundle'
import MemoryFS from 'memory-fs'
import Modules from './Modules'
import chalk from 'chalk'
import config from '../../config'
import deferred from '../../utils/deferred'
import fsRequire from '../../utils/fsRequire'
import path from 'path'
import server from '../../utils/server'
import printStats from '../../utils/printStats'
import assets from '../../utils/assets'

process.env.PORT = config.server.port

export default class Development {
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
        config: config.server.webpack,
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
        config: config.browser.webpack,
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
          printStats(false, serverStats)
        }
        else if (browserStats.hasErrors() && (!this.server.stats || !this.server.stats.hasErrors())) {
          printStats(false, browserStats)
        }
        else {
          if (this.compiled) {
            console.log(chalk.green(`Application rebuilt`))
            require('frontful-config')
            this.server.requestHandler = fsRequire(this.fs, this.server.filename)
            global.frontful.environment.coldreload.reload()
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

  rebuild() {
    this.server.bundle.rebuild()
    // this.browser.bundle.rebuild()
  }

  start() {
    Promise.all([
      this.server.bundle.watch(
        this.startHandler.bind(this, 'server'),
        this.endHandler.bind(this, 'server')
      ),
      this.browser.bundle.watch(
        this.startHandler.bind(this, 'browser'),
        this.endHandler.bind(this, 'browser')
      ),
    ]).then((stats) => {
      printStats(false, ...stats)

      console.log(chalk.green(`Application built`))

      assets(stats[1].toJson({
        children: false,
        chunkModules: false,
        chunks: false,
        assets: true,
        hash: false,
        modules: false,
        timings: false,
        version: false,
      }).assetsByChunkName)

      require('frontful-config')
      require('../../utils/coldreload/server')

      this.server.filename = path.resolve(config.server.webpack.output.path, stats[0].compilation.entrypoints.server.chunks[0].files[0])
      this.server.requestHandler = fsRequire(this.fs, this.server.filename)

      const httpServer = server((req, res) => this.server.requestHandler(req, res), {
        fs: this.fs,
        assets: true,
      })

      global.frontful.environment.coldreload.start(httpServer)
    }).then(() => {
      this.compiled = true
      new Modules().watch(() => {
        this.rebuild()
      })
    }).catch((e) => console.log(e))
  }
}
