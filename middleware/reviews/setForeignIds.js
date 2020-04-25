const setForeignIds = (req, res, next) => {
  // made to work with two route patterns - /api/v1/reviews and /api/v1/tours/2a3gF89ctar/reviews/
  // if using first, user and tour should be in body already, if not get from params and isAuth
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

module.exports = setForeignIds
