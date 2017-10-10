let Coldreload

if (process.env.NODE_ENV !== 'production') {
  const socketio = require('socket.io')
  const chalk = require('chalk')

  Coldreload = class {
    get state() {
      process.nextTick(() => {
        this._state = null
      })
      return this._state
    }

    set state(state) {
      this._state = state
    }

    start(server) {
      this.socket = socketio(server, {
        path: '/frontful-coldreload',
      })

      this.socket.on('connection', (browser) => {
        this.log('Browser connected')

        browser.on('frontful.coldreload.state', (state, ack) => {
          this.state = state
          ack(true)
        })
      })
    }

    reload() {
      this.socket.emit('frontful.coldreload.reload', null, {for: 'everyone'})
    }

    log() {
      console.log(chalk.gray.apply(chalk, arguments))
    }
  }
}
else {
  Coldreload = class {
    get state() {
      return null
    }
    start() {}
    reload() {}
    log() {}
  }
}

global.frontful = global.frontful || {}
global.frontful.environment = global.frontful.environment || {}

global.frontful.environment.coldreload = new Coldreload()
