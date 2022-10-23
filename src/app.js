const fs = require('fs') // Node.js module
const express = require('express')
const cors = require('cors')
const app = express()
const helmet = require('helmet')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const route = require('./routes')
const bodyParser = require('body-parser')

app.use(
  cors({
    origin: '*',
  })
)
app.use(fileUpload({
  useTempFiles: true
}))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
route(app)
module.exports = {
  app,
}
