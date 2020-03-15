const chalk = require('chalk')

// For non-error messages, pretty-prints objects.
const log = (...inputs) => {
  console.log(
    ...inputs.map(input => {
      let item = input
      if (typeof item === 'object') {
        item = JSON.stringify(item, null, 2)
      }
      return chalk.bgHex('#fff').green(item)
    })
  )
}

// For errors, can pass error msg, or error object.
const logError = err => {
  console.error('💥💥💥', chalk.red('ERROR'), '💥💥💥')
  if (err instanceof Error) {
    console.error(chalk.red(err.stack))
  } else {
    console.error(chalk.red(err))
  }
}

module.exports = {
  log,
  logError
}
