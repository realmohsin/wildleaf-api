const crypto = require('crypto')
const { promisify } = require('util')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userFields = require('./userFields')
const AppError = require('../../utils/AppError')
const { log } = require('../../utils/consoleLog')

const userSchema = new mongoose.Schema(
  {
    email: userFields.email,
    password: userFields.password,
    name: userFields.name,
    photo: userFields.photo,
    role: userFields.role,
    sessions: userFields.sessions,
    passwordChangedAt: userFields.passwordChangedAt,
    passwordResetToken: userFields.passwordResetToken,
    passwordResetExpires: userFields.passwordResetExpires,
    active: userFields.active
  },
  {
    timestamps: true
  }
)

userSchema.statics.fieldsForUserCreate = ['email', 'password', 'name', 'photo']

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user) throw new AppError('Incorrect email or password')
  const passwordIsCorrect = await bcrypt.compare(password, user.password)
  if (!passwordIsCorrect) throw new AppError('Incorrect email or password', 401)
  return user
}

userSchema.statics.clearIncomingSession = async req => {
  const token = req.cookies.sessionToken
  console.log('from clearInc', token)
  if (!token) return
  try {
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    )
    const user = await User.findById(decodedToken._id)
    await user.clearSession(token)
  } catch (error) {
    return
  }
}

userSchema.methods.createSession = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  log(jwt.decode(token))
  this.sessions = this.sessions.concat({ token })
  await this.save()
  return token
}

userSchema.methods.clearSession = async function (token) {
  this.sessions = this.sessions.filter(session => session.token !== token)
  await this.save()
}

userSchema.methods.clearExpiredSessions = async function () {
  this.sessions = this.sessions.filter(session => {
    const { exp } = jwt.decode(session.token)
    if (Date.now() >= exp) return false
    return true
  })
  await this.save()
}

userSchema.methods.changedPasswordAfter = function (thisTimestamp) {
  if (this.passwordChangedAt) {
    const pwChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return thisTimestamp < pwChangedTimestamp
  }
  return false
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000 // subtract a second for database latency
    }
  }
  next()
})

// // query middleware
// userSchema.pre(/^find/, function (next) {
//   // 'this' points to query object
//   this.find({ active: { $ne: false } })
//   next()
// })

// userSchema.methods.correctPassword = async function (attemptedPw, pw) {
//   return await bcrypt.compare(attemptedPw, pw)
// }

// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString('hex')
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex')
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10min
//   return resetToken
//   // values updated in instance, but not saved to db yet
// }

// For future refactor
// setPasswordResetToken
// clearPasswordResetToken

const User = mongoose.model('User', userSchema)

module.exports = User
