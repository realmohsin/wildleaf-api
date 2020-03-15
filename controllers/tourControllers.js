const withCatch = require('../utils/withCatch')

const queryTours = withCatch(async (req, res) => {})

const addTour = withCatch(async (req, res) => {})

const getTour = withCatch(async (req, res) => {})

const updateTour = withCatch(async (req, res) => {})

const deleteTour = withCatch(async (req, res) => {})

const getTop5Cheapest = withCatch(async (req, res) => {})

const getTourStats = withCatch(async (req, res) => {})

const getMonthlyTourStarts = withCatch(async (req, res) => {})

module.exports = {
  queryTours,
  addTour,
  getTour,
  updateTour,
  deleteTour,
  getTop5Cheapest,
  getTourStats,
  getMonthlyTourStarts
}
