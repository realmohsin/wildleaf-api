const { logError } = require('../utils/consoleLog')
const AppError = require('../utils/AppError')
const jSend = require('../utils/jSend')

const handleDevError = (res, err) => {
  logError(err)
  const { statusCode, status, message, stack } = err
  if (status === 'fail') {
    jSend.fail(res, statusCode, message, { error: err, stack })
  } else if (status === 'error') {
    jSend.error(res, statusCode, message, { error: err, stack })
  }
}

const handleProdError = (res, err) => {
  console.log(err)
  logError(err)
  const { statusCode, status, message, stack } = err
  if (status === 'fail') {
    jSend.fail(res, statusCode, message)
  } else if (status === 'error') {
    if (err instanceof AppError) {
      jSend.error(res, statusCode, message)
    } else {
      jSend.error(res, statusCode, 'Something went wrong')
    }
  }
}

// check for errors from packages that we can consider as AppErrors
const checkForAppError = err => {
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token. Please authenticate again.', 401)
  } else if (err.name === 'TokenExpiredError') {
    return new AppError('Expired token. Please authenticate again.', 401)
  }
  return err
}

const handleError = (err, req, res, next) => {
  const env = process.env.NODE_ENV
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (env !== 'production') return handleDevError(res, err)
  if (err instanceof AppError) return handleProdError(res, err)

  let errAfterCheck = checkForAppError(err)

  handleProdError(res, errAfterCheck)
}

module.exports = { handleError }
