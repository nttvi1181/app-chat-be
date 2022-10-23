const { STATUS_USER } = require('../../../../utils/constants.utils')
const {
  JOIN_APP,
  LEAVE_APP,
  SEND_MESSAGE_LIVE_ROOM,
  SERVER_SEND_MESSAGE_LIVE_ROOM,
} = require('../../../../utils/SocketEvent')

class SocketServices {
  connection(socket) {
    socket.on('disconnect', (msg) => {
      console.log('user disconnect', socket.id)
    })

    socket.on(JOIN_APP, (msg) => {
      console.log('JOIN APP', JSON.stringify(msg))
    })

    socket.on(LEAVE_APP, (msg) => {
      console.log(`User leave app`, msg)
    })

    socket.on(SEND_MESSAGE_LIVE_ROOM, (msg) => {
      _io.to(msg.liveId).emit(SERVER_SEND_MESSAGE_LIVE_ROOM, msg)
    })
  }
}
module.exports = new SocketServices()
