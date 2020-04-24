const withCatch = require('../utils/withCatch')
const User = require('../models/User')
const jSend = require('../utils/jSend')
const QueryBuilder = require('../database/QueryBuilder')
const AppError = require('../utils/AppError')
const filterReqBody = require('../utils/filterReqBody')

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

const updateSelf = withCatch(async (req, res, next) => {
  const updates = filterReqBody(req.body, 'name', 'email')
  // can use find^ because we DONT want to run password 'save' middleware
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  })
  jSend.success(res, 200, { updatedUser })
})

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined.'
  })
}

const deleteSelf = withCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  jSend.success(res, 204, null)
})

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
  updateSelf,
  updateUser,
  deleteSelf,
  deleteUser
}
