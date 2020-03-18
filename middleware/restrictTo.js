const AppError = require('../utils/AppError')

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have the correct permissions.', 403))
  }
  next()
}

module.exports = restrictTo
