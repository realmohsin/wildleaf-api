const express = require('express')
const errorControllers = require('./controllers/errorControllers')
const logger = require('./middleware/logger')
const AppError = require('./utils/AppError')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(logger)
}

app.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      message: 'hello wildleaf-api'
    }
  })
})

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find path ${req.originalUrl} on this server`, 404))
})

app.use(errorControllers.handleError)

module.exports = app
