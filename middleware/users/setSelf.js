const setSelf = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

module.exports = setSelf
