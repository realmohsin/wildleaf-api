const withCatch = require('../utils/withCatch')
const Tour = require('../models/Tour')
const sendSuccessRes = require('../utils/sendSuccessRes')
const QueryBuilder = require('../database/QueryBuilder')
const {
  tourStatsPipeline,
  monthlyTourStartsPipeline
} = require('../database/aggregations')

const queryTours = withCatch(async (req, res) => {
  const query = Tour.find()
  const queryBuilder = new QueryBuilder(query, { ...req.query })
  queryBuilder
    .filter()
    .sort()
    .paginate()
    .limitFields()
  const tours = await queryBuilder.query
  sendSuccessRes(res, 200, { tours })
})

const addTour = withCatch(async (req, res) => {
  const tour = new Tour(req.body)
  await tour.save()
  sendSuccessRes(res, 201, { tour })
})

const getTour = withCatch(async (req, res) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  sendSuccessRes(res, 200, { tour })
})

const updateTour = withCatch(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  sendSuccessRes(res, 200, { tour })
})

const deleteTour = withCatch(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  sendSuccessRes(res, 204, null)
})

const getTourStats = withCatch(async (req, res) => {
  const pipeline = await Tour.aggregate(tourStatsPipeline())
  const stats = await pipeline
  console.log(pipeline)
  sendSuccessRes(res, 200, { stats })
})

const getMonthlyTourStarts = withCatch(async (req, res) => {
  const year = +req.params.year
  const pipeline = await Tour.aggregate(monthlyTourStartsPipeline(year))
  const tourStartsByMonth = await pipeline
  sendSuccessRes(res, 200, { tourStartsByMonth })
})

module.exports = {
  queryTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyTourStarts
}
