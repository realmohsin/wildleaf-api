const mongoose = require('mongoose')
const slugify = require('slugify')
const { log, logError } = require('../../utils/consoleLog')
const tourFields = require('./tourFields')

const tourSchema = new mongoose.Schema(
  {
    name: tourFields.name,
    slug: tourFields.slug,
    duration: tourFields.duration,
    maxGroupSize: tourFields.maxGroupSize,
    difficulty: tourFields.difficulty,
    ratingsAverage: tourFields.ratingsAverage,
    ratingsQuantity: tourFields.ratingsQuantity,
    price: tourFields.price,
    priceDiscount: tourFields.priceDiscount,
    summary: tourFields.summary,
    description: tourFields.description,
    imageCover: tourFields.imageCover,
    images: tourFields.images,
    createdAt: tourFields.createdAt,
    startDates: tourFields.startDates,
    startLocation: tourFields.startLocation,
    locations: tourFields.locations,
    guides: tourFields.guides,
    privateTour: tourFields.privateTour
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Indexes

tourSchema.index({ slug: 1 })
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ startLocation: '2dsphere' })

// ----------- Class Static Properties and Methods -----------------------

tourSchema.statics.resourceName = 'tour'

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

// DOCUMENT MIDDLEWARE: runs only before .save() and .create()
tourSchema.pre('save', function (next) {
  // 'this' is instance or document-to-be
  this.slug = slugify(this.name, { lower: true })
  next()
})

tourSchema.pre('save', function (next) {
  // log('Saving document...')
  next()
})

tourSchema.post('save', function (doc, next) {
  // log('Document saved: ', doc._id)
  next()
})

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ privateTour: { $ne: true } })
  // this.select('-privateTour')
  this.start = Date.now()
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  const executionTime = Date.now() - this.start
  log(`Query took ${executionTime} milliseconds.`)
  next()
})

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name'
  })
  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // this.pipeline().unshift({ $match: { privateTour: { $ne: true } } })
  // log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
