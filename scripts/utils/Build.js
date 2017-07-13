const Bundle = require('./Bundle')
const chalk = require('chalk')
const config = require('../../config')
const fs = require('fs')
const path = require('path')
const printStats = require('../../utils/printStats')
const rimraf = require('rimraf')

module.exports = class Build {
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
      printStats(true, [serverStats, browserStats])
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
        require('frontful-environment/utils/assets')(${assetsByChunkName});
        var server = require('frontful-environment/utils/server');
        var requestListener = require('./server.js');
        server(requestListener, {assets: ${config.server.assets.toString()}});
      `)
    }).catch((error) => {
      printStats(true, error)
    })
  }
}
