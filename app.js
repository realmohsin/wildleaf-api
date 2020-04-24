const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const stopPollution = require('./middleware/stopPollution')
const rateLimiter = require('./middleware/rateLimiter')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')
const errorController = require('./controllers/errorController')
const logger = require('./middleware/logger')
const AppError = require('./utils/AppError')

const app = express()

app.use(logger)
app.use(helmet())
app.use(rateLimiter(100, 1000 * 60 * 60))

app.use(cookieParser())
app.use(express.json())

app.use(stopPollution())
app.use(xss())
app.use(mongoSanitize())

app.use('/api/v1', userRouter)
app.use('/api/v1', tourRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find path ${req.originalUrl} on this server`, 404))
})

app.use(errorController.handleError)

module.exports = app
