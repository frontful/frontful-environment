export default function deferred() {
  let resolve, reject, resolved

  return {
    get resolve() {
      return resolve
    },
    get reject() {
      return reject
    },
    get resolved() {
      return resolved
    },
    promise: new Promise((_resolve, _reject) => {
      resolve = function() {
        if (!resolved) {
          resolved = true
          return _resolve.apply(this, arguments)
        }
      }
      reject = function() {
        if (!resolved) {
          resolved = true
          return _reject.apply(this, arguments)
        }
      }
    }),
  }
}
