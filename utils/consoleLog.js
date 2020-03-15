const chalk = require('chalk')

// For non-error messages, pretty-prints objects.
const log = (...inputs) => {
  console.log(
    inputs
      .map(input => {
        let item = input
        if (typeof item === 'object') {
          item = JSON.stringify(item, null, 2)
        }
        return chalk.bgHex('#fff').green(item)
      })
      .join('')
  )
}

// For errors, can pass error msgs, or error objects.
const logError = (...errors) => {
  console.error('❌❌❌', chalk.red('ERROR'), '❌❌❌')
  console.error(
    errors
      .map(err => {
        if (err instanceof Error) {
          return chalk.red(err.stack)
        } else {
          return chalk.red(err)
        }
      })
      .join('')
  )
}

module.exports = {
  log,
  logError
}
