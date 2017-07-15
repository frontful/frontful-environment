const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

module.exports = function errorParser(e) {
  let result = []
  try {
    const stack = e.stack
      .replace(/^.*\n/i, '')
      .replace(RegExp(process.cwd() + '/', 'gi'), './')
      .replace(/\(.+webpack:\//gi, '(./')
      .replace(/.*__webpack_require__.*\n/ig, '')
      .replace(/.*\(build\/.*\n/ig, '')
      .match(/\(.*\)/gi).map((item) => {
        return item.substr(1, item.length - 2)
          .replace(/:(\d+:\d+)/gi, ' ($1)')
      })

    result.push('')
    result.push(chalk.red.bold(`ERROR in ${stack.splice(0, 1)}`))
    result.push(chalk.red.bold(`${e.name}: ${e.message}`))
    result.push('')
    stack.forEach((item) => {
      result.push(` @ ${item}`)
    })
    result.push('')
  }
  catch(_e) {
    result = [e.stack]
  }

  const joined = result.join('\n')

  return {
    colorful: joined,
    string: stripAnsi(joined)
  }
}
