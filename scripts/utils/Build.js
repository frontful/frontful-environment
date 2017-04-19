import Bundle from './Bundle'
import chalk from 'chalk'
import config from '../../config'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

export default class Development {
  constructor() {
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
      }),
    }

    this.browser = {
      bundle: new Bundle({
        config: config.webpack.browser,
      }),
    }
  }

  run() {
    rimraf.sync(path.resolve(process.cwd(), 'build'))
    Promise.all([
      this.server.bundle.build(),
      this.browser.bundle.build(),
    ]).then(() => {
      console.log(chalk.bold.green(`Application built`))
      const serverIndexPath = path.resolve(process.cwd(), 'build/server/index.js')
      fs.writeFileSync(serverIndexPath, `
        process.env.NODE_ENV = 'production';
        require('frontful-config');
        var requestListener = require('./server.js');
        require('frontful-environment/utils/server')(requestListener, {assets: true});
      `)
      process.exit(0)
    }).catch((error) => {
      console.error(error)
      process.exit(1)
    })
  }
}
