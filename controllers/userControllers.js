const withCatch = require('../utils/withCatch')
const User = require('../models/User')
const jSend = require('../utils/jSend')
const QueryBuilder = require('../database/QueryBuilder')

const queryUsers = withCatch(async (req, res) => {
  const users = await User.find()
  jSend.success(res, 200, { users })
})

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.'
  })
}

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.'
  })
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.'
  })
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.'
  })
}

module.exports = {
  queryUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
}
