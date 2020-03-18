const mongoose = require('mongoose')
const validator = require('validator')

const userFields = {
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
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  sessions: {
    type: [
      new mongoose.Schema(
        {
          token: { type: String, required: true }
        },
        { strict: false } // non-schema fields can be set with doc.set(key, value)
      )
    ]
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: { type: Date },
  active: {
    type: Boolean,
    default: true,
    select: false // this field must be requested specifically
  }
}

module.exports = userFields
