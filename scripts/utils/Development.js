const Bundle = require('./Bundle')
const MemoryFS = require('memory-fs')
const bundle = require('../../utils/bundle')
const chalk = require('chalk')
const commonConfig = require('frontful-common/config')
const config = require('../../config')
const errorParser = require('../../utils/errorParser')
const fs = require('fs')
const path = require('path')
const printStats = require('../../utils/printStats')
const requireFile = require('../../utils/requireFile')
const server = require('../../utils/server')
const {deferred} = require('frontful-utils')

process.env.PORT = config.server.port

const ignored = new RegExp(`(node_modules.*node_modules)|(node_modules/(?!(${commonConfig.packages.join('|')})/))`)

module.exports = class Development {
  constructor() {
    this.fs = config.memory ? new MemoryFS() : null

    const getServerFilename = () => {
      return this.server && this.server.filename
    }

    const getFileSystem = () => {
      return this.fs || fs
    }

    require('source-map-support').install({
      handleUncaughtExceptions: false,
      hookRequire: true,
      environment: 'node',
      retrieveSourceMap: (source) => {
        try {
          if (source === getServerFilename()) {
            return {
              url: source,
              map: getFileSystem().readFileSync(source.replace(/\.js$/i, '.js.map'), 'utf8')
            };
          }
        } catch(error) {}
        return null
      }
    })

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
            for(let id in require.cache) {
              if (!ignored.test(id)) {
                delete require.cache[id]
              }
            }
            require('frontful-config')
            this.server.requestHandler = requireFile(this.server.filename, {fs: this.fs})
            global.frontful.environment.coldreload.reload()
          }
        }

        this.server.stats = serverStats
        this.browser.stats = browserStats
      }).catch((e) => e ? console.log(errorParser(e).colorful) : null)
    }
  }

  endHandler(bundle, stats) {
    this[bundle].compile.resolve(stats)
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
      printStats(false, stats)

      console.log(chalk.green(`Application built`))

      bundle(stats[1].toJson({
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

      this.server.filename = path.resolve(config.server.webpack.output.path, stats[0].compilation.entrypoints.get('server').chunks[0].files[0])
      this.server.requestHandler = requireFile(this.server.filename, {fs: this.fs})

      const httpServer = server((req, res) => this.server.requestHandler(req, res), {
        fs: this.fs,
        assets: config.server.assets,
      })

      global.frontful.environment.coldreload.start(httpServer)
    }).then(() => {
      this.compiled = true
    }).catch((e) => {
      console.log(errorParser(e).colorful)
      process.exit(1)
    })
  }
}
