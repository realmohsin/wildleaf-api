if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv')
  dotenv.config({ path: './config.env' })
}

const fs = require('fs')
const path = require('path')
const db = require('../database')
const Tour = require('../../models/Tour/Tour')
const User = require('../../models/User/User')
const Review = require('../../models/Review/Review')
const { log, logError } = require('../../utils/consoleLog')

;(async () => {
  await db.connect(process.env.MONGODB_CONNECT_STRING)
  const seedTours = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../', 'data/tours.json'))
  )
  const seedUsers = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../', 'data/users.json'))
  )
  const seedReviews = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../', 'data/reviews.json'))
  )
  await Tour.create(seedTours)
  log('Tour seeds saved to database')
  await User.create(seedUsers, { validateBeforeSave: false })
  log('User seeds saved to database')
  await Review.create(seedReviews)
  log('Review seeds saved to database')
  process.exit()
})().catch(logError)
