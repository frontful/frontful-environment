import MemoryFS from 'memory-fs'
import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import config from '../config'
import createAssetHandler from '../utils/createAssetHandler'
import deferred from '../utils/deferred'
import fsRequire from '../utils/fsRequire'
import http from 'http'
import path from 'path'
import webpack from 'webpack'

const options = commandLineArgs([{
  name: 'port',
  alias: 'p',
  type: Number,
  defaultOption: true,
  defaultValue: 8000,
}])

process.noDeprecation = true
process.preserveSymlinks = true
process.env.PORT = options.port

class Bundle {
  constructor(options) {
    this.options = options
    this.options.watch = this.options.watch || {
      aggregateTimeout: 100
    }
    this.compiler = webpack(this.options.config)
    this.compiler.outputFileSystem = this.options.fs || this.compiler.outputFileSystem
    this.compiled = false
  }

  build(start, end) {
    return new Promise((resolve) => {
      this.compiler.plugin("watch-run", (compiler, next) => {
        start()
        next()
      })

      this.compiler.watch(this.options.watch, (error, stats) => {
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
}

class Build {
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
      filename: path.resolve(config.webpack.server.output.path, 'server.js'),
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
  }

  startHandler(bundle) {
    if (this[bundle].compile) {
      this[bundle].compile.reject()
    }

    this[bundle].compile = deferred()

    if (this.server.compile && this.browser.compile) {
      Promise.all([this.server.compile.promise, this.browser.compile.promise]).then((stats) => {
        const {0: serverStats, 1: browserStats} = stats

        if (serverStats.hasErrors() && (!this.browser.stats || !this.browser.stats.hasErrors())) {
          console.log(serverStats.toString({...this.options.stats, assets: false}))
        }
        else if (browserStats.hasErrors() && (!this.server.stats || !this.server.stats.hasErrors())) {
          console.log(browserStats.toString({...this.options.stats, assets: false}))
        }
        else {
          if (this.compiled) {
            console.log(chalk.green(`Rebuild successfull`))
            this.server.requestHandler = fsRequire(this.fs, this.server.filename)
          }
        }

        this.server.stats = serverStats
        this.browser.stats = browserStats
      }).catch((e) => console.log(e))
    }
  }

  endHandler(bundle, stats) {
    this[bundle].compile.resolve(stats)
  }

  run() {
    Promise.all([
      this.server.bundle.build(
        this.startHandler.bind(this, 'server'),
        this.endHandler.bind(this, 'server')
      ),
      this.browser.bundle.build(
        this.startHandler.bind(this, 'browser'),
        this.endHandler.bind(this, 'browser')
      ),
    ]).then((stats) => {
      console.log(stats[1].toString(this.options.stats))
      console.log(chalk.bold.green(`Build successfull`))

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
    }).catch((e) => console.log(e))
  }
}

new Build().run()
