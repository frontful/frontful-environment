import {isBrowser} from 'frontful-utils'

export default {
  get bundle() {
    return isBrowser() ? null : global.frontful.environment.bundle
  },
  get coldreload() {
    return isBrowser() ? window.frontful.environment.coldreload : global.frontful.environment.coldreload
  },
  get error() {
    return isBrowser() ? null : global.frontful.environment.error
  },
  get listener() {
    return isBrowser() ? null : global.frontful.environment.listener
  },
  get server() {
    return isBrowser() ? null : global.frontful.environment.server
  },
}
