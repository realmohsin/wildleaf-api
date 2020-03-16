const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'A valid email must be provided']
  },
  password: {
    type: String,
    required: [true, 'A password must be provided'],
    minlength: 8,
    select: false // this field must be requested specifically
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password must be confirmed'],
    validate: {
      // this only works on 'create' and 'save', not on find^ methods
      validator: function (val) {
        return val === this.password
      },
      message: 'Passwords do not match'
    }
  },
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  photo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (attemptedPw, pw) {
  return await bcrypt.compare(attemptedPw, pw)
}

const User = mongoose.model('User', userSchema)

module.exports = User
