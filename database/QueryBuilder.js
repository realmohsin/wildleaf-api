// wrapper for mongoose query object
// use methods to selectively build the query from req.query
// return/use the query on instance.query

class QueryBuilder {
  constructor (query, queryFromReq) {
    // query should be mongoose query object
    // queryFromReq is clone of req.query
    this.query = query
    this.queryFromReq = { ...queryFromReq }
  }

  // applies (default) filters
  filter () {
    let filterFields = { ...this.queryFromReq }
    const flagsToRemove = ['sort', 'page', 'limit', 'fields']
    flagsToRemove.forEach(flag => delete filterFields[flag])
    const strFilterFields = JSON.stringify(filterFields).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    )
    filterFields = JSON.parse(strFilterFields)
    this.query.find(filterFields)
    return this
  }

  // applies (default) sorting
  sort () {
    let sortBy
    if (this.queryFromReq.sort) {
      sortBy = this.queryFromReq.sort.split(',').join(' ')
    } else {
      sortBy = '-createdAt'
    }
    this.query.sort(sortBy)
    return this
  }

  // applies (default) pagination
  paginate () {
    const page = +this.queryFromReq.page || 1
    const limit = +this.queryFromReq.limit || 100
    const skip = (page - 1) * limit
    this.query.skip(skip).limit(limit)
    return this
  }

  // applies (default) field limiting
  limitFields () {
    if (this.queryFromReq.fields) {
      const fields = this.queryFromReq.fields.split(',').join(' ')
      this.query.select(fields)
    } else {
      this.query.select('-__v')
    }
    return this
  }
}

module.exports = QueryBuilder
