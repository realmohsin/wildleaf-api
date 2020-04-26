const {
  makeQueryHandler,
  makeGetOneHandler,
  makeCreateOneHandler,
  makeDeleteOneHandler,
  makeUpdateOneHandler
} = require('./crudFactory')
const withCatch = require('../utils/withCatch')
const AppError = require('../utils/AppError')
const Review = require('../models/Review/Review')
const jSend = require('../utils/jSend')
const QueryBuilder = require('../database/QueryBuilder')

// made to work with two route patterns - /api/v1/reviews and /api/v1/tours/2a3gF89ctar/reviews/

const queryReviews = makeQueryHandler(Review)
const createReview = makeCreateOneHandler(Review)
const getReview = makeGetOneHandler(Review)
const updateReview = makeUpdateOneHandler(Review)
const deleteReview = makeDeleteOneHandler(Review)

module.exports = {
  queryReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview
}
