const sendSuccessRes = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'success',
    data
  })
}

module.exports = sendSuccessRes
