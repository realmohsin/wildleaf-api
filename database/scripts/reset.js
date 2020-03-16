if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv')
  dotenv.config({ path: './config.env' })
}

const db = require('../index')
const Tour = require('../../models/Tour')
const { log, logError } = require('../../utils/consoleLog')

;(async () => {
  await db.connect(process.env.MONGODB_CONNECT_STRING)
  await Tour.deleteMany()
  log('All tours in database deleted')
  process.exit()
})().catch(logError)
