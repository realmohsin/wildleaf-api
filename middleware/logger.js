const morgan = require('morgan')
const chalk = require('chalk')

const logger = morgan((tokens, req, res) => {
  const applyBlueBold = chalk.hex('#1e90ff').bold
  const applySuccessColor = chalk.bgHex('#fff').green
  const applyFailColor = chalk.bgHex('#fff').red

  const method = applyBlueBold(tokens.method(req, res))
  const url = applyBlueBold(tokens.url(req, res))
  const date = applyBlueBold(tokens.date(req, res))
  const reqIp = applyBlueBold(tokens['remote-addr'](req, res))
  let status

  if (res.statusCode >= 400) {
    status = applyFailColor(tokens.status(req, res))
  } else {
    status = applySuccessColor(tokens.status(req, res))
  }

  return `➡️   ${method} ${url} ${status} - on (${date}) from (${reqIp})`
})

module.exports = logger
