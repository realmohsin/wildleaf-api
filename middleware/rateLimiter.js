const rateLimit = require('express-rate-limit')

const rateLimiter = (max, windowMs) =>
  rateLimit({
    max,
    windowMs,
    message: 'Too many requests from this IP, try again later.'
  })

module.exports = rateLimiter
