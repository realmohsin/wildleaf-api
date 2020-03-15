const { log, logError } = require('./utils/consoleLog')

process.on('uncaughtException', err => {
  logError('Uncaught Exception ❌ Shutting down...\n', err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logError('Unhandled Rejection ❌ Shutting down...\n', err)
  if (server) {
    server.close(() => process.exit(1))
  }
})

const app = require('./app')

let server
const port = process.env.PORT

server = app.listen(port, () =>
  log(`✅  Web Server Running on Port ${port}...`)
)
