class AppError extends Error {
  constructor (message, statusCode, data) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.statusCode = statusCode
    this.data = data

    Error.captureStackTrace(this, this.constructor) // removes constructor from stack trace
  }
}

module.exports = AppError
