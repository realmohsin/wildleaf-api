const { logError } = require('../utils/consoleLog')
const AppError = require('../utils/AppError')

const sendErrorDetails = (err, res) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const status = err instanceof AppError ? err.status : 'error'
  const jsonResp = {
    status,
    message: err.message,
    stack: err.stack
  }
  if (err.data) {
    jsonResp.data = err.data
  }
  logError(err)
  res.status(statusCode).json(jsonResp)
}

const sendProdErrMsg = (err, res) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const status = err instanceof AppError ? err.status : 'error'
  const jsonResp = {
    status,
    message: err instanceof AppError ? err.message : 'Internal Server Error'
  }
  if (err.data) {
    jsonResp.data = err.data
  }
  logError(err)
  res.status(statusCode).json(jsonResp)
}

const handleError = (err, req, res, next) => {
  const env = process.env.NODE_ENV
  if (err instanceof AppError) {
    return env === 'production'
      ? sendProdErrMsg(err, res)
      : sendErrorDetails(err, res)
  }
  let finalErr
  // check if err should be AppError
  if (err.code === '3200242afafa') {
    finalErr = new AppError('safafl', 343)
  } else if (err.code === '3424afafagaga') {
    finalErr = new AppError('asdfadf', 3525)
  } else {
    finalErr = err
  }
  env === 'production'
    ? sendProdErrMsg(finalErr, res)
    : sendErrorDetails(finalErr, res)
}

module.exports = { handleError }
