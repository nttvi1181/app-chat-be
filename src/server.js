const { app } = require('./app')
const http = require('http').Server(app)
const io = require('socket.io')(http)

require('dotenv').config()
const SocketServices = require('./api/v1/services/socket/socket.service')
// const connectDB = require('./config/database.config')
const PORT = process.env.PORT || 8080

global.__basedir = __dirname
global._io = io
// connectDB()
io.on('connection', SocketServices.connection)
http.listen(PORT, () => {
  console.log('server is opening on port', PORT)
})
