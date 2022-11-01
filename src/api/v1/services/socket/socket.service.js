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

async function sendToMultiple(message, array, data) {
  console.log("data",data)
  return Promise.all(array?.map((item) => _io.to(item).emit(message, data)))
}
class SocketServices {
  connection(socket) {
    console.log('new user connect socket', socket.id)
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
          socket.emit(CLIENT_SEND_MESSAGE_ERROR, { ...msg, messageError: error })
          return
        }
        const { is_check_conversation, recive_id, sender_id, conversation_id, message_id } = msg
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
        const dataInsertMessage = { ...msg }
        delete dataInsertMessage.is_check_conversation
        Promise.all([
          MessageService.create(dataInsertMessage),
          ConversationService.updateByConversationId(conversation_id, {
            last_message: message_id,
          }),
        ])
          .then(() => {
            sendToMultiple(SERVER_SEND_NEW_MESSAGE, _.uniq([...recive_id, sender_id]), {
              ...msg,
              is_sent: true,
            })
              .then(() => {
                console.log('LOG => SEND NEW MESSAGE SUCCESS', JSON.stringify(msg))
              })
              .catch((e) => {
                console.log('e', e)
                console.log('LOG => SEND NEW MESSAGE FAIL', JSON.stringify(msg))
              })
          })
          .catch((e) => {
            console.log('LOG => SEND MESSAGE ERROR', e)
            socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
          })
      } catch (error) {
        console.log('error', error)
        socket.emit(CLIENT_SEND_MESSAGE_ERROR, msg)
      }
    })

    socket.on(LEAVE_APP, (msg) => {
      console.log(`User leave app`, msg)
    })
  }
}
module.exports = new SocketServices()
