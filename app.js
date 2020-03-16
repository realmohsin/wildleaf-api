const express = require('express')
const tourRouter = require('./routes/tourRouter')
const errorControllers = require('./controllers/errorControllers')
const logger = require('./middleware/logger')
const AppError = require('./utils/AppError')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(logger)
}

app.use(express.json())

app.use('/api/v1', tourRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find path ${req.originalUrl} on this server`, 404))
})

app.use(errorControllers.handleError)

module.exports = app
