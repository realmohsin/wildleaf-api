if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv')
  dotenv.config({ path: './config.env' })
}

const db = require('../database')
const User = require('../../models/User/User')
const Tour = require('../../models/Tour/Tour')
const Review = require('../../models/Review/Review')
const { log, logError } = require('../../utils/consoleLog')

;(async () => {
  await db.connect(process.env.MONGODB_CONNECT_STRING)
  await User.deleteMany()
  log('All users in database deleted')
  await Tour.deleteMany()
  log('All tours in database deleted')
  await Review.deleteMany()
  log('All reviews in database deleted')
  process.exit()
})().catch(logError)
