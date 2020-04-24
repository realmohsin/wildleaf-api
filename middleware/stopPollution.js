const hpp = require('hpp')

const whitelist = [
  'duration',
  'ratingsQuantity',
  'ratingsAverage',
  'maxGroupSize',
  'difficulty',
  'price'
]

const stopPollution = () => hpp({ whitelist })

module.exports = stopPollution
