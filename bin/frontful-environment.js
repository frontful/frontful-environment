#!/usr/bin/env node
require('babel-register')(require('babel-preset-frontful'))

const command = process.argv[2]

switch(command) {
  case 'start': {
    require('../scripts/start')
    break
  }
  case 'build': {
    require('../scripts/build')
    break
  }
  default: {
  }
}
