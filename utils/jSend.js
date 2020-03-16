// send json response in standardized format
const jSend = {
  success (res, statusCode, data) {
    res.status(statusCode).json({
      status: 'success',
      data
    })
  }
}

module.exports = jSend
