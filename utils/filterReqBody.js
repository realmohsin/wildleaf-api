// for making sure only the needed or allowed fields are used from req.body when updating or creating resources
const filterReqBody = (reqBody, ...allowedFields) => {
  const allowedData = {}
  Object.keys(reqBody).forEach(key => {
    if (allowedFields.includes(key)) {
      allowedData[key] = reqBody[key]
    }
  })
  return allowedData
}

module.exports = filterReqBody
