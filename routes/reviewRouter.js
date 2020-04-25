const express = require('express')
const {
  queryReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController')
const isAuth = require('../middleware/isAuth')
const restrictTo = require('../middleware/restrictTo')
const setForeignIds = require('../middleware/reviews/setForeignIds')

// made to work with two route patterns - /api/v1/reviews and /api/v1/tours/2a3gF89ctar/reviews/

const reviewRouter = express.Router({ mergeParams: true })

reviewRouter.use(isAuth)

// REST routes
reviewRouter.get('/', queryReviews)
reviewRouter.post('/', restrictTo('admin', 'user'), setForeignIds, createReview)
reviewRouter.get('/:id', getReview)
reviewRouter.patch('/:id', restrictTo('admin', 'user'), updateReview)
reviewRouter.delete('/:id', restrictTo('admin', 'user'), deleteReview)

module.exports = reviewRouter
