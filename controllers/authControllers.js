const jwt = require('jsonwebtoken')
const User = require('../models/User')
const withCatch = require('../utils/withCatch')
const jSend = require('../utils/jSend')
const AppError = require('../utils/AppError')

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

const signup = withCatch(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body
  const newUser = await User.create({ name, email, password, passwordConfirm })
  const token = signToken(newUser._id)
  jSend.success(res, 201, { user: newUser, token })
})

const login = withCatch(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new AppError('Email or password not provided', 400))
  }
  const user = await User.findOne({ email }).select('+password') // have to request specifically
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }
  const token = signToken(user._id)
  jSend.success(res, 200, { token })
})

module.exports = {
  signup,
  login
}
