const mongoose = require('mongoose')
const slugify = require('slugify')
const { log, logError } = require('../../utils/consoleLog')
const reviewFields = require('./reviewFields')

const reviewSchema = new mongoose.Schema(
  {
    review: reviewFields.review,
    rating: reviewFields.rating,
    tour: reviewFields.tour,
    user: reviewFields.user
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// ----------- Class Static Properties and Methods -----------------------

reviewSchema.statics.resourceName = 'review'

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name'
  // })
  this.populate({ path: 'user', select: 'name' })
  next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
