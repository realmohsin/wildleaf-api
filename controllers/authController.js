const crypto = require('crypto')
const User = require('../models/User')
const withCatch = require('../utils/withCatch')
const jSend = require('../utils/jSend')
const AppError = require('../utils/AppError')
const sendEmail = require('../email/sendEmail')
const filterReqBody = require('../utils/filterReqBody')
const addSessionCookie = require('../utils/addSessionCookie')

const handleSignUp = withCatch(async (req, res, next) => {
  await User.clearIncomingSession(req)
  const filteredData = filterReqBody(req.body, ...User.fieldsForUserCreate)
  const newUser = await User.create(filteredData)
  const token = await newUser.createSession()
  addSessionCookie(res, token)
  jSend.success(res, 201, { message: 'New account created.', user: newUser })
})

const handleLogIn = withCatch(async (req, res, next) => {
  await User.clearIncomingSession(req)
  const { email, password } = filterReqBody(req.body, 'email', 'password')
  if (!email || !password)
    throw new AppError('Email or password not provided', 400)
  const user = await User.findByCredentials(email, password)
  const token = await user.createSession()
  addSessionCookie(res, token)
  jSend.success(res, 200, { message: 'Successfully logged in.' })
})

const handleLogOut = withCatch(async (req, res, next) => {
  await req.user.clearSession(req.session.token)
  res.clearCookie('sessionToken') // built in express method
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

// for setting new password without prior password
const sendNewPasswordEmail = withCatch(async (req, res, next) => {
  console.log('from sendNewPasswordEmail')

  // 1) get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with that email.', 404))
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken() // maybe move saving to inside this
  await user.save({ validateBeforeSave: false }) // turn off validation

  // 3) Send to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message
    })
    jSend.success(res, 200, { message: 'Password reset token sent to email.' })
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    )
  }
})

// for setting new password without prior password
const resetPassword = withCatch(async (req, res, next) => {
  // 1) Get user based on token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  // 2) If token has not expired, and there is user, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save() // keep validation on
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id)
  jSend.success(res, 200, { token })
})

module.exports = {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  updatePassword,
  sendNewPasswordEmail,
  resetPassword
}
