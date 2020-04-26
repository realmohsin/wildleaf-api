const mongoose = require('mongoose')
const { log } = require('../utils/consoleLog')

const db = {
  async connect (connect_string) {
    await mongoose.connect(connect_string, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    log('✅ DB connection successful')
  }
}

module.exports = db
