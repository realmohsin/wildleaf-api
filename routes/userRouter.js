const express = require('express')
const authControllers = require('../controllers/authControllers')
const userControllers = require('../controllers/userControllers')

const userRouter = express.Router()

// auth routes
userRouter.post('/users/signup', authControllers.signup)
userRouter.post('/users/login', authControllers.login)

// REST routes
userRouter.get('/users', userControllers.queryUsers)
// userRouter.post('/users')
// userRouter.get('/users/:id')
// userRouter.patch('/users/:id')
// userRouter.delete('/users/:id')

module.exports = userRouter
