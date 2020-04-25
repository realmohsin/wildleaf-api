const setTop5Cheapest = (req, res, next) => {
  req.query.sort = 'price,ratingsAverage'
  req.query.limit = '5'
  next()
}

module.exports = { setTop5Cheapest }
