const express = require('express')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')
const errorController = require('./controllers/errorController')
const logger = require('./middleware/logger')
const AppError = require('./utils/AppError')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(logger)
}

app.use(cookieParser())
app.use(express.json())

app.use('/api/v1', userRouter)
app.use('/api/v1', tourRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find path ${req.originalUrl} on this server`, 404))
})

app.use(errorController.handleError)

module.exports = app
