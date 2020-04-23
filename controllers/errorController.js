const { logError } = require('../utils/consoleLog')
const AppError = require('../utils/AppError')
const jSend = require('../utils/jSend')

const handleDevError = (res, err) => {
  logError(err)
  const { statusCode = 500, status = 'error', message, stack } = err
  if (status === 'fail') {
    jSend.fail(res, statusCode, message, { error: err, stack })
  } else if (status === 'error') {
    jSend.error(res, statusCode, message, { error: err, stack })
  }
}

const handleProdError = (res, err) => {
  logError(err)
  const { statusCode = 500, status = 'error', message } = err
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
  if (err instanceof AppError) return err
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token. Please authenticate again.', 401)
  } else if (err.name === 'TokenExpiredError') {
    return new AppError('Expired token. Please authenticate again.', 401)
  }
  return err
}

const handleError = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') return handleDevError(res, err)
  let errAfterCheck = checkForAppError(err)
  handleProdError(res, errAfterCheck)
}

module.exports = { handleError }
