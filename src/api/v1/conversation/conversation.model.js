const mongoose = require('mongoose')
const schema = mongoose.Schema
const connect = require('../../../config/database.config')

const ConversationSchema = new schema(
  {
    conversation_id: {
      type: 'string',
      unique: true,
    },
    display_name: {
      type: 'string',
      default: null,
    },
    members: {
      type: 'array',
      default: [],
    },
    last_message: {
      type: 'string',
      default: null,
    },
    avatar_url: {
      type: 'string',
    },
  },
  { timestamps: true }
)

module.exports = {
  Conversation: connect.model('Conversation', ConversationSchema),
}
