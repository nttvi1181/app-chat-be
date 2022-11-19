const mongoose = require('mongoose')
const { User } = require('../user/user.model')
const connect = require('../../../config/database.config')
const schema = mongoose.Schema

const codeVerifySchema = new schema(
  {
    userId: {
      type: 'string',
      ref: User.modelName,
    },
    code: {
      type: 'string',
      required: true,
    },
    expireAt: {
      type: Date,
      default: new Date(),
      expires: 300000,
    },
  },
  { timestamps: true }
)
module.exports = {
  codeVerifyModel: connect.model('codeVerify', codeVerifySchema),
}
