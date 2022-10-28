const _ = require('lodash')
const { STATUS_USER } = require('../../../../utils/constants.utils')
const {
  JOIN_APP,
  LEAVE_APP,
  CLIENT_SEND_NEW_MESSAGE,
  CLIENT_SEND_MESSAGE_ERROR,
  SERVER_SEND_NEW_MESSAGE,
} = require('../../../../utils/SocketEvent')
const { ConversationService } = require('../../conversation/conversation.service')
const { MessageService } = require('../../message/message.service')
const { validateMessage } = require('../../message/message.validation')
class SocketServices {
  sendToMultiple(message, array, data) {
    return Promise.all(array?.map((item) => async () => _io.socket.to(item).emit(message, data)))
  }

  connection(socket) {
    socket.on('disconnect', (msg) => {
      console.log('user disconnect', socket.id)
    })

    socket.on(JOIN_APP, (msg) => {
      console.log('JOIN APP', JSON.stringify(msg))
      const { user_id } = msg
      if (!user_id) return
      socket.join(user_id)
    })

    socket.on(CLIENT_SEND_NEW_MESSAGE, async (msg) => {
      try {
        const { error } = validateMessage(msg)
        if (error) {
          socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
          return
        }

        const { is_check_conversation, recive_id, conversation_id, message_id } = msg
        let conversation = null
        if (is_check_conversation) {
          conversation = await ConversationService.getByConversationId(conversation_id)
          if (!conversation) {
            const dataNewConversation = {
              conversation_id,
              members: _.uniq([...recive_id, sender_id]),
            }
            conversation = await ConversationService.create(dataNewConversation)
          }
        }
        await MessageService.create(msg)
        await ConversationService.updateByConversationId(conversation_id, {
          last_message: message_id,
        })
        sendToMultiple(SERVER_SEND_NEW_MESSAGE, _.uniq([...recive_id, sender_id]), msg)
          .then(() => {
            console.log('LOG => SEND NEW MESSAGE SUCCESS', JSON.stringify(msg))
          })
          .catch(() => {
            console.log('LOG => SEND NEW MESSAGE FAIL', JSON.stringify(msg))
          })
      } catch (error) {
        socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
      }
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
