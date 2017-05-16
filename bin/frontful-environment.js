#!/usr/bin/env node
const command = process.argv[2]

switch(command) {
  // case 'start': {
  //   const spawn = require('child_process').spawn;
  //   spawn('node', ['--preserve-symlinks', '--preserve-symlinks', __filename, 'development', '--preserve-symlinks'], {stdio: 'inherit'})
  //   break
  // }
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
  }
}
