const express = require('express')
const isAuth = require('../middleware/isAuth')
const {
  handleSignUp,
  handleLogIn,
  handleLogOut,
  updatePassword,
  sendPasswordResetEmail,
  resetPassword
} = require('../controllers/authController')
const {
  queryUsers,
  updateSelf,
  deleteSelf
} = require('../controllers/userController')

// routes that use authController and/or userController

const userRouter = express.Router()

// auth routes
userRouter.post('/users/signup', handleSignUp)
userRouter.post('/users/login', handleLogIn)
userRouter.post('/users/logout', isAuth, handleLogOut)

userRouter.patch('/users/update-password', isAuth, updatePassword)

userRouter.post('/users/request-password-reset', sendPasswordResetEmail)
userRouter.patch('/users/reset-password/:passwordResetToken', resetPassword)

userRouter.patch('/users/update-self', isAuth, updateSelf)
userRouter.delete('/users/delete-self', isAuth, deleteSelf)

// REST routes
userRouter.get('/users', queryUsers)
// userRouter.post('/users')
// userRouter.get('/users/:id')
// userRouter.patch('/users/:id')
// userRouter.delete('/users/:id')

module.exports = userRouter