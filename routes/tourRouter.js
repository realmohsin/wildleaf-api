const express = require('express')
const reviewRouter = require('./reviewRouter')
const {
  queryTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyTourStarts,
  getToursWithin,
  getDistancesToTours
} = require('../controllers/tourController')
const { setTop5Cheapest } = require('../middleware/tours/setToursQuery')
const isAuth = require('../middleware/isAuth')
const restrictTo = require('../middleware/restrictTo')

const tourRouter = express.Router()

tourRouter.use('/:tourId/reviews', reviewRouter)

// order matters for routes

// custom routes
tourRouter.get('/top-5-cheap', setTop5Cheapest, queryTours)
tourRouter.get('/tour-stats', getTourStats)
tourRouter.get(
  '/monthly-tour-starts/:year',
  isAuth,
  restrictTo('admin', 'lead-guide', 'guide'),
  getMonthlyTourStarts
)
tourRouter.get(
  '/tours-within/:distance/center/:latlng/unit/:unit',
  getToursWithin
)
tourRouter.get('/distances/:latlng/unit/:unit', getDistancesToTours)

// REST routes
tourRouter.get('/', queryTours)
tourRouter.post('/', isAuth, restrictTo('admin', 'lead-guide'), createTour)
tourRouter.get('/:id', getTour)
tourRouter.patch('/:id', isAuth, restrictTo('admin', 'lead-guide'), updateTour)
tourRouter.delete('/:id', isAuth, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = tourRouter
