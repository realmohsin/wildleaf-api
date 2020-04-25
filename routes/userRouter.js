const express = require('express')
const isAuth = require('../middleware/isAuth')
const restrictTo = require('../middleware/restrictTo')
const setSelf = require('../middleware/users/setSelf')
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
  getUser,
  updateSelf,
  updateUser,
  deleteSelf,
  deleteUser
} = require('../controllers/userController')

// routes that use authController and/or userController

const userRouter = express.Router()

// auth routes
userRouter.post('/signup', handleSignUp)
userRouter.post('/login', handleLogIn)
userRouter.post('/logout', isAuth, handleLogOut)

userRouter.patch('/update-password', isAuth, updatePassword)

userRouter.post('/request-password-reset', sendPasswordResetEmail)
userRouter.patch('/reset-password/:passwordResetToken', resetPassword)

userRouter.get('/self', isAuth, setSelf, getUser)
userRouter.patch('/update-self', isAuth, updateSelf)
userRouter.delete('/delete-self', isAuth, deleteSelf)

userRouter.use(isAuth) // all rest routes should be protected
userRouter.use(restrictTo('admin'))

// REST routes
userRouter.get('/', queryUsers)
// userRouter.post('/')
userRouter.get('/:id', getUser)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

module.exports = userRouter
