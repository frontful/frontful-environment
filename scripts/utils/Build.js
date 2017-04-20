import Bundle from './Bundle'
import chalk from 'chalk'
import config from '../../config'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import printStats from '../../utils/printStats'

export default class Build {
  constructor() {
    this.server = {
      bundle: new Bundle({
        config: config.server.webpack,
      }),
    }

    this.browser = {
      bundle: new Bundle({
        config: config.browser.webpack,
      }),
    }
  }

  run() {
    rimraf.sync(path.resolve(process.cwd(), 'build'))
    Promise.all([
      this.server.bundle.build(),
      this.browser.bundle.build(),
    ]).then(([serverStats, browserStats]) => {
      printStats(true, serverStats, browserStats)
      console.log(chalk.green(`Application built`))

      const serverIndexPath = path.resolve(process.cwd(), './build/server/index.js')

      const assetsByChunkName = JSON.stringify(browserStats.toJson({
        children: false,
        chunkModules: false,
        chunks: false,
        assets: true,
        hash: false,
        modules: false,
        timings: false,
        version: false,
      }).assetsByChunkName)

      fs.writeFileSync(serverIndexPath, `
        process.env.NODE_ENV = 'production';
        require('frontful-config');
        require('frontful-environment/utils/assets')(${assetsByChunkName})
        var requestListener = require('./server.js');
        require('frontful-environment/utils/server')(requestListener, {assets: true});
      `)
    }).catch((error) => {
      printStats(true, error)
    })
  }
}
