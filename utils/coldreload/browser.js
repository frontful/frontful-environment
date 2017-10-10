let Coldreload

if (process.env.NODE_ENV !== 'production') {
  const socketio = require('socket.io-client')

  Coldreload = class {
    constructor() {
      this.socket = socketio('/', {
        path: '/frontful-coldreload',
      })

      this.socket.on('connect', () => {
        this.log('Server connected')
      })

      this.socket.on('frontful.coldreload.reload', () => {
        if (this.serializer) {
          const data = this.serializer()
          localStorage.setItem('frontful.coldreload.state', JSON.stringify(data))
          this.socket.emit('frontful.coldreload.state', data, () => {
            window.location.reload()
          })
          this.log('State stored and serialize')
        }
        else {
          window.location.reload()
        }
      })
    }

    serializer = null

    get deserializer() {
      return this._deserializer
    }

    set deserializer(deserializer) {
      this._deserializer = deserializer
      this.deserialize()
    }

    deserialize() {
      const strData = localStorage.getItem('frontful.coldreload.state')
      localStorage.setItem('frontful.coldreload.state', '')
      const data = strData ? JSON.parse(strData) : null
      if (data) {
        this.deserializer(data)
        this.log('State restored and deserialized')
      }
    }

    log(text) {
      console.log(`%c${text}`, 'color: gray;')
    }
  }
}
else {
  Coldreload = class {
    deserialize() {}
    log() {}
  }
}

window.frontful = window.frontful || {}
window.frontful.environment = window.frontful.environment || {}
window.frontful.environment.coldreload = new Coldreload()
