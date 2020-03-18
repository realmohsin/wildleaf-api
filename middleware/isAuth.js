const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { log } = require('../utils/consoleLog')
const AppError = require('../utils/AppError')
const withCatch = require('../utils/withCatch')

const isAuth = withCatch(async (req, res, next) => {
  const token = req.cookies.sessionToken
  if (!token) throw new AppError('Not authenticated', 401)
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  )
  const user = await User.findById(decodedToken._id)
  if (!user) throw new AppError('Cannot find user. Authenticate again.', 401)
  const session = user.sessions.find(session => session.token === token)
  if (!session)
    throw new AppError('Session does not exist. Authenticate again', 401)
  if (user.changedPasswordAfter(decodedToken.iat)) {
    await user.clearSession(token)
    throw new AppError(
      'Password was recently changed. Authenticate again.',
      401
    )
  }
  req.user = user
  req.session = session // in controllers, req.session.set(key, value) to add data
  next()
})

module.exports = isAuth
