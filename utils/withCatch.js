// wrap controllers to replace try..catch blocks
module.exports = fn => (req, res, next) => fn(req, res, next).catch(next)
