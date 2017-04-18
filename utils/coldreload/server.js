import socketio from 'socket.io'
import chalk from 'chalk'

export default class Coldreload {
  constructor(server) {
    this.socket = socketio(server)

    this.socket.on('connection', (browser) => {
      this.log('Browser connected')

      browser.on('frontful.coldreload.state', (state, ack) => {
        ack(true)
      })
    })
  }

  reload() {
    this.socket.emit('frontful.coldreload.reload', null, {for: 'everyone'})
  }

  log(...args) {
    console.log(chalk.gray.apply(chalk, args))
  }
}
