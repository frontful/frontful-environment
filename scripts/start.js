process.env.NODE_ENV = 'development'

require('babel-register')(require('babel-preset-frontful/server'))

const Development = require('./utils/Development')

new Development().start()
