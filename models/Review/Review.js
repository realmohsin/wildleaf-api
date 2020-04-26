const mongoose = require('mongoose')
const slugify = require('slugify')
const { log, logError } = require('../../utils/consoleLog')
const reviewFields = require('./reviewFields')
const Tour = require('../Tour/Tour')

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

// index for making sure a user can only review a tour once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.statics.resourceName = 'review'

reviewSchema.statics.setAvgRatingFor = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ])
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length ? stats[0].nRating : 0,
    ratingsAverage: stats.length ? stats[0].avgRating : 4.5
    // why is default rating 4.5 lol?
  })
}

reviewSchema.post('save', function () {
  Review.setAvgRatingFor(this.tour)
})

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

reviewSchema.post(/^findOneAnd/, async function (review, next) {
  if (review) {
    // trying to update/delete a doc that doesn't exist means review will be null and error will be thrown here
    // better to send control back to the calling scope so the 404 can be thrown
    await Review.setAvgRatingFor(review.tour)
  }
  next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
