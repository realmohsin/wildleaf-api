// send json response in standardized format
const jSend = {
  success (res, statusCode, data) {
    res.status(statusCode).json({
      status: 'success',
      data
    })
  },
  fail (res, statusCode, message, data) {
    const jsonRes = {
      status: 'fail',
      message
    }
    if (data) jsonRes.data = data
    res.status(statusCode).json(jsonRes)
  },
  error (res, statusCode, message, data) {
    const jsonRes = {
      status: 'error',
      message
    }
    if (data) jsonRes.data = data
    res.status(statusCode).json(jsonRes)
  }
}

module.exports = jSend
