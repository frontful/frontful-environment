const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

module.exports = function errorParser(e) {
  let result = [], where, what, how
  
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

    where = `ERROR in ${stack.splice(0, 1)}`
    what = `${e.name}: ${e.message}`
    how = stack.map((item) => ` @ ${item}`).join('\n')

    result.push('')
    result.push(chalk.red.bold(where))
    result.push(chalk.red.bold(what))
    result.push('')
    result.push(how)
    result.push('')
  }
  catch(_e) {
    result = [e.stack]
  }

  const joined = result.join('\n')

  return {
    colorful: joined,
    string: stripAnsi(joined),
    details: {
      where,
      what,
      how,
    }
  }
}
