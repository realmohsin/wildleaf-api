const tourStatsPipeline = () => [
  {
    $match: {
      ratingsAverage: { $gte: 4.5 }
    }
  },
  {
    $group: {
      _id: { $toUpper: '$difficulty' },
      numOfTours: { $sum: 1 },
      numOfRatings: { $sum: '$ratingsQuantity' },
      avgRating: { $avg: '$ratingsAverage' },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' }
    }
  },
  { $sort: { avgPrice: 1 } }
]

const monthlyTourStartsPipeline = year => [
  { $unwind: '$startDates' },
  {
    $match: {
      startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    }
  },
  {
    $group: {
      _id: { $month: '$startDates' },
      numOfTourStarts: { $sum: 1 },
      tours: { $push: '$name' }
    }
  },
  { $addFields: { month: '$_id' } },
  { $project: { _id: 0 } },
  { $sort: { numOfTourStarts: -1 } }
]

module.exports = { tourStatsPipeline, monthlyTourStartsPipeline }
