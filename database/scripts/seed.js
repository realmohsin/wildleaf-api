if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv')
  dotenv.config({ path: './config.env' })
}

const fs = require('fs')
const path = require('path')
const db = require('../index')
const Tour = require('../../models/Tour')
const { log, logError } = require('../../utils/consoleLog')

;(async () => {
  await db.connect(process.env.MONGODB_CONNECT_STRING)
  const seedTours = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../', 'data/dev-tours.json'))
  )
  await Tour.create(seedTours)
  log('Seed tours saved to database')
  process.exit()
})().catch(logError)
