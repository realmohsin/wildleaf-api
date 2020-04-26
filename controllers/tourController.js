const {
  makeQueryHandler,
  makeGetOneHandler,
  makeCreateOneHandler,
  makeDeleteOneHandler,
  makeUpdateOneHandler
} = require('./crudFactory')
const withCatch = require('../utils/withCatch')
const AppError = require('../utils/AppError')
const Tour = require('../models/Tour/Tour')
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

const getToursWithin = withCatch(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')
  if (!lat || !lng) next(new AppError('Latitude and longitude required', 400))
  // mongo wants radius in radians - distance divided by radius of earth
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })
  jSend.success(res, 200, { count: tours.length, tours })
})

const getDistancesToTours = withCatch(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')
  if (!lat || !lng) next(new AppError('Latitude and longitude required', 400))
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  jSend.success(res, 200, { distances })
})

module.exports = {
  queryTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyTourStarts,
  getToursWithin,
  getDistancesToTours
}
