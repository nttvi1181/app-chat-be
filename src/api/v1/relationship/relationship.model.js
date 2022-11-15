const mongoose = require('mongoose')
const schema = mongoose.Schema
const connect = require('../../../config/database.config')

const RelationshipSchema = new schema(
  {
    sender_id: {
      type: 'string',
    },
    recive_id: {
      type: 'string',
    },
    status: {
      type: 'string',
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = {
  Relationship: connect.model('Relationship', RelationshipSchema),
}
