import WebpackIsomorphicTools from 'webpack-isomorphic-tools'
import chokidar from 'chokidar'
import clearRequireCache from '../utils/clearRequireCache'
import config from '../config'
import http from 'http'
import path from 'path'
import socketIo from 'socket.io'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import chalk from 'chalk'

process.noDeprecation = true
process.preserveSymlinks = true

const compiler = webpack(config.browser.webpack)
const assets = require('../provider/webpack/config.assets')()
const cwd = process.cwd()

const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: config.browser.webpack.output.publicPath,
  stats: {
    children: false,
    chunkModules: false,
    chunks: false,
    colors: true,
    hash: false,
    modules: false,
    timings: true,
  },
})

const webpackIsomorphicTools = new WebpackIsomorphicTools(assets).server(cwd, () => {
  devMiddleware.waitUntilValid(() => {
    const serverScript = path.resolve(cwd, config.server.script)

    const server = http.createServer((req, res) => {
      devMiddleware(req, res, () => {
        devMiddleware.waitUntilValid(() => {
          require(serverScript)(req, res)
        })
      })
    })

    const listener = server.listen(process.env.PORT || 80, function onStart(err) {
      if (err) {
        console.error(err)
      }
      else {
        process.env.PORT = listener.address().port || 80
        console.log(chalk.bold.green(`Server aviable at`, chalk.underline(`http://localhost:${process.env.PORT}`)))

        const watcher = chokidar.watch([
          path.resolve(cwd, 'src'),
          cwd + '/**/frontful-*',
        ])

        watcher.on('ready', function() {
          const io = socketIo(server)

          io.on('connection', function(socket) {
            console.log(chalk.gray('Browser connected'))
            io.emit('coldreload', 'connected', {for: 'everyone'})
            socket.on('disconnect', function(){
              console.log(chalk.gray('Browser disconnected'))
            })
          })

          watcher.on('all', function() {
            clearRequireCache()
            webpackIsomorphicTools.refresh()
            io.emit('coldreload', 'reload', {for: 'everyone'})
          })
        })
      }
    })
  })
})
