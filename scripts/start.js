process.env.NODE_ENV = 'development'
process.env.NODE_PRESERVE_SYMLINKS = true

const Development = require('./utils/Development')

new Development().start()
