const {
  makeQueryHandler,
  makeGetOneHandler,
  makeDeleteOneHandler,
  makeUpdateOneHandler
} = require('./crudFactory')
const withCatch = require('../utils/withCatch')
const User = require('../models/User')
const jSend = require('../utils/jSend')
const QueryBuilder = require('../database/QueryBuilder')
const AppError = require('../utils/AppError')
const filterReqBody = require('../utils/filterReqBody')

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not work. Use sign up route.'
  })
}

const queryUsers = makeQueryHandler(User)
const getUser = makeGetOneHandler(User)
const updateUser = makeUpdateOneHandler(User)
const deleteUser = makeDeleteOneHandler(User)

const updateSelf = withCatch(async (req, res, next) => {
  const updates = filterReqBody(req.body, 'name', 'email')
  // can use find^ because we DONT want to run password 'save' middleware
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  })
  jSend.success(res, 200, { updatedUser })
})

const deleteSelf = withCatch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  jSend.success(res, 204, null)
})

module.exports = {
  queryUsers,
  createUser,
  getUser,
  updateSelf,
  updateUser,
  deleteSelf,
  deleteUser
}
