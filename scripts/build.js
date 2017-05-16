process.env.NODE_ENV = 'production'

require('babel-register')(require('babel-preset-frontful/server'))

const Build = require('./utils/Build')

new Build().run()
