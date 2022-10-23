const mongoose = require('mongoose')
const schema = mongoose.Schema

const messageSchema = new schema(
  {
    message_id: {
      type: 'string',
    },
    conversation_id: {
      type: 'string',
    },
    sender_id: {
      type: schema.ObjectId,
    },
    recive_id: {
      type: schema.ObjectId,
    },
    content: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    message_parent_id: {
      type: 'string',
    },
    is_deleted: {
      type: 'boolean',
      default: false,
    },
    is_recalled: {
      type: 'boolean',
      default: false,
    },
    member_seens: {
      type: 'array',
      default: [],
    },
    reactions:{
      type: 'array',
      default: [],
    }
  },
  { timestamps: true }
)

module.exports = {
  MessageModel: mongoose.model('Message', messageSchema),
}
