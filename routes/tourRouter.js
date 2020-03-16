const express = require('express')
const {
  queryTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyTourStarts
} = require('../controllers/tourControllers')
const { setTop5Cheapest } = require('../middleware/setToursQuery')

const tourRouter = express.Router()

// crud
tourRouter.get('/tours', queryTours)
tourRouter.post('/tours', addTour)
tourRouter.get('/tours/:id', getTour)
tourRouter.patch('/tours/:id', updateTour)
tourRouter.delete('/tours/:id', deleteTour)

// custom
tourRouter.get('/tours/top-5-cheap', setTop5Cheapest, queryTours)
tourRouter.get('/tours/tour-stats', getTourStats)
tourRouter.get('/tours/monthly-tour-starts/:year', getMonthlyTourStarts)

module.exports = tourRouter
