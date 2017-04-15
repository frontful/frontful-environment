#!/usr/bin/env node
require('babel-register')(require('babel-preset-frontful'))

const command = process.argv[2]

switch(command) {
  case 'start': {
    require('./start')
    break
  }
  case 'build': {
    require('./build')
    break
  }
  default: {
    console.log('Unknown command')
  }
}
