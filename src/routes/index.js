const createError = require('http-errors')
const { API, USER, V1 } = require('../utils/enpoint.utils')
const UserRoute = require('./User.Router')
const S3Route = require('./s3Media.route')
const route = (app) => {
  app.use(`${API}${V1}${USER}`, UserRoute)
  app.use(`${API}${V1}/s3media`, S3Route)

  app.use('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  app.use((req, res, next) => {
    next(createError.NotFound())
  })
  app.use((err, req, res, next) => {
    res.json({
      status: err.status || 500,
      message: err.message,
    })
  })
}

module.exports = route
