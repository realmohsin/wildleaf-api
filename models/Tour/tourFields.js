const mongoose = require('mongoose')
const validator = require('validator')

const tourFields = {
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [
      40,
      'A tour name must have less than or equal to 40 characters'
    ],
    minlength: [8, 'A tour name must have more than or equal to 8 characters']
    // validate: [validator.isAlpha, 'Tour name must only contain letters']
  },
  slug: String, // set in pre-save middleware
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 3.5,
    // min, max works for dates as well
    min: [1, 'Rating must greater than or equal to 1.0'],
    max: [5, 'Rating must be less than or equal to 5.0 '],
    set: val => Math.round(val * 10) / 10 // rounds to one decimal
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        // 'this' only points to current doc on NEW document creation
        return val < this.price
      },
      // mongo specific auto string templating for certain values
      message: 'Discount price ({VALUE}) cannot be larger than the price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  privateTour: {
    type: Boolean,
    default: false
  }
}

module.exports = tourFields
