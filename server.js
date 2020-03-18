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

if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv')
  dotenv.config({ path: './config.env' })
}

// //test production mode
// const dotenv = require('dotenv')
// dotenv.config({ path: './config.env' })

const db = require('./database')
const app = require('./app')

let server
const port = process.env.PORT

;(async () => {
  await db.connect(process.env.MONGODB_CONNECT_STRING)
  server = app.listen(port, () => log(`✅ Server Running on Port ${port}...`))
})().catch(logError)
