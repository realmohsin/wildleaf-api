const crypto = require('crypto')
const User = require('../models/User')
const withCatch = require('../utils/withCatch')
const jSend = require('../utils/jSend')
const AppError = require('../utils/AppError')
const sendEmail = require('../email/sendEmail')
const filterReqBody = require('../utils/filterReqBody')
const { addSessionCookie, clearSessionCookie } = require('../utils/cookieUtils')
const createEmail = require('../email/createEmail')
const { logError } = require('../utils/consoleLog')

const handleSignUp = withCatch(async (req, res, next) => {
  const filteredData = filterReqBody(req.body, ...User.fieldsForUserCreate)
  const newUser = await User.create(filteredData)
  await User.deleteIncomingSession(req)
  const token = await newUser.createSession()
  addSessionCookie(res, token)
  jSend.success(res, 201, { message: 'New account created.', user: newUser })
})

const handleLogIn = withCatch(async (req, res, next) => {
  const { email, password } = filterReqBody(req.body, 'email', 'password')
  if (!email || !password)
    throw new AppError('Email or password not provided', 400)
  const user = await User.findByCredentials(email, password)
  await User.deleteIncomingSession(req)
  const token = await user.createSession()
  addSessionCookie(res, token)
  jSend.success(res, 200, { message: 'Successfully logged in.' })
})

const handleLogOut = withCatch(async (req, res, next) => {
  await req.user.deleteSession(req.session.token)
  clearSessionCookie(res)
  jSend.success(res, 200, { message: 'Successfully logged out.' })
})

// change this drastically in refactor - authRoute should handle a lot of whats going on
// for updating password with prior password
const updatePassword = withCatch(async (req, res, next) => {
  // 1) get user with credentials from body
  const user = await User.findById(req.user.id).select('+password')

  // 2) check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Password is incorrect.', 401))
  }

  // 3) if so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save() // dont use find^ methods since you need to trigger validation and save middleware

  // 4) send jwt
  const token = signToken(user._id)
  jSend.success(res, 200, { token })
})

const sendPasswordResetEmail = withCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new AppError('No user with that email.', 404))
  const passwordResetToken = await user.createPasswordResetToken()
  const passwordResetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${passwordResetToken}`
  try {
    const email = createEmail(user.email, 'password-reset', {
      passwordResetURL
    })
    await sendEmail(email)
    jSend.success(res, 200, { message: 'Password reset email sent.' })
  } catch (error) {
    await user.clearPasswordResetToken()
    logError(error)
    const appErrMsg = 'There was an error sending the email. Try again later.'
    next(new AppError(appErrMsg, 500))
  }
})

const resetPassword = withCatch(async (req, res, next) => {
  const passwordResetToken = req.params.passwordResetToken
  const user = await User.findByPasswordResetToken(passwordResetToken)
  user.password = req.body.password
  await user.clearPasswordResetToken() // will save the password change as well
  await User.deleteIncomingSession(req)
  const token = await user.createSession()
  addSessionCookie(res, token)
  jSend.success(res, 200, { message: 'Password was reset and changed.' })
})

module.exports = {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  updatePassword,
  sendPasswordResetEmail,
  resetPassword
}
