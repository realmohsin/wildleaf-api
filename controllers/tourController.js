const withCatch = require('../utils/withCatch')
const AppError = require('../utils/AppError')
const Tour = require('../models/Tour')
const jSend = require('../utils/jSend')
const QueryBuilder = require('../database/QueryBuilder')
const {
  tourStatsPipeline,
  monthlyTourStartsPipeline
} = require('../database/aggregations')

const queryTours = withCatch(async (req, res, next) => {
  req.session.set('data', { hello: 'xc', fire: 'foo' })
  console.log('req.session', req.session)
  console.log('req.user.sessions', req.user.sessions)
  await req.user.save()
  const query = Tour.find()
  const queryBuilder = new QueryBuilder(query, { ...req.query })
  queryBuilder
    .filter()
    .sort()
    .paginate()
    .limitFields()
  const tours = await queryBuilder.query
  jSend.success(res, 200, { tours })
})

const createTour = withCatch(async (req, res, next) => {
  const tour = new Tour(req.body)
  await tour.save()
  jSend.success(res, 201, { tour })
})

const getTour = withCatch(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  jSend.success(res, 200, { tour })
})

const updateTour = withCatch(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  jSend.success(res, 200, { tour })
})

const deleteTour = withCatch(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  jSend.success(res, 204, null)
})

const getTourStats = withCatch(async (req, res, next) => {
  const pipeline = Tour.aggregate(tourStatsPipeline())
  const stats = await pipeline
  console.log(pipeline)
  jSend.success(res, 200, { stats })
})

const getMonthlyTourStarts = withCatch(async (req, res, next) => {
  const year = +req.params.year
  const pipeline = Tour.aggregate(monthlyTourStartsPipeline(year))
  const tourStartsByMonth = await pipeline
  jSend.success(res, 200, { tourStartsByMonth })
})

module.exports = {
  queryTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyTourStarts
}
