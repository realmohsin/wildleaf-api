// wrap controllers to replace try..catch blocks
// can throw errors instead of passing to next in wrapped controllers/middleware
module.exports = fn => (req, res, next) => fn(req, res, next).catch(next)
