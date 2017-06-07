#!/usr/bin/env node
const command = process.argv[2]

switch(command) {
  case 'start':
  case 'development': {
    require('../scripts/start')
    break
  }
  case 'build': {
    require('../scripts/build')
    break
  }
  default: {
    console.log(`Unknown command, ${command}`)
  }
}
