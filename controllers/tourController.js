const {
  makeQueryHandler,
  makeGetOneHandler,
  makeCreateOneHandler,
  makeDeleteOneHandler,
  makeUpdateOneHandler
} = require('./crudFactory')
const withCatch = require('../utils/withCatch')
const AppError = require('../utils/AppError')
const Tour = require('../models/Tour')
const jSend = require('../utils/jSend')
const {
  tourStatsPipeline,
  monthlyTourStartsPipeline
} = require('../database/aggregations')

const queryTours = makeQueryHandler(Tour)
const createTour = makeCreateOneHandler(Tour)
const getTour = makeGetOneHandler(Tour, { path: 'reviews' })
const updateTour = makeUpdateOneHandler(Tour)
const deleteTour = makeDeleteOneHandler(Tour)

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
