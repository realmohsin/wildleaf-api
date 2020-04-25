const withCatch = require('../utils/withCatch')
const AppError = require('../utils/AppError')
const jSend = require('../utils/jSend')
const QueryBuilder = require('../database/QueryBuilder')

const makeQueryHandler = Model =>
  withCatch(async (req, res, next) => {
    const query = Model.find()
    const queryOptions = { ...req.query }
    if (req.params.tourId) {
      // for nested review routes
      queryOptions.tour = req.params.tourId
    }
    const queryBuilder = new QueryBuilder(query, queryOptions)
    queryBuilder
      .filter()
      .sort()
      .paginate()
      .limitFields()
    const docs = await queryBuilder.query
    jSend.success(res, 200, {
      count: docs.length,
      [Model.resourceName + 's']: docs
    })
  })

const makeGetOneHandler = (Model, populateOptions) =>
  withCatch(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate(populateOptions)
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    jSend.success(res, 200, { [Model.resourceName]: doc })
  })

const makeCreateOneHandler = Model =>
  withCatch(async (req, res, next) => {
    const doc = new Model(req.body)
    await doc.save()
    jSend.success(res, 201, { [Model.resourceName]: doc })
  })

const makeUpdateOneHandler = Model =>
  withCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    jSend.success(res, 200, { [Model.resourceName]: doc })
  })

const makeDeleteOneHandler = Model =>
  withCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    jSend.success(res, 204, null)
  })

module.exports = {
  makeQueryHandler,
  makeGetOneHandler,
  makeCreateOneHandler,
  makeDeleteOneHandler,
  makeUpdateOneHandler
}
