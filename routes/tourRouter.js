const express = require('express')
const {
  queryTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  getTop5Cheapest,
  getTourStats,
  getMonthlyTourStarts
} = require('../controllers/tourControllers')

const tourRouter = express.Router()

// crud
tourRouter.get('/tours', queryTours)
tourRouter.post('/tours', addTour)
tourRouter.get('/tours/:id', getTour)
tourRouter.patch('/tours/:id', updateTour)
tourRouter.delete('/tours/:id', deleteTour)

// custom
tourRouter.get('/tours/top-5-cheap', getTop5Cheapest)
tourRouter.get('/tours/tour-stats', getTourStats)
tourRouter.get('/tours/monthly-tour-starts/:year', getMonthlyTourStarts)

module.exports = tourRouter
