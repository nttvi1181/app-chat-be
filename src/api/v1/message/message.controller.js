const { MessageModel } = require('./message.model')
const createError = require('http-errors')
const { MessageService } = require('./message.service')
const { ConversationService } = require('../conversation/conversation.service')

module.exports = {
  MessageController: {
    getByConversationId: async (req, res) => {
      try {
        const { conversation_id } = req.params
        const { userId } = req
        let skip = 0
        let limit = 20
        if (req.query.limit) {
          limit = req.query.limit
        }
        if (req.query.skip) {
          skip = req.query.skip
        }
        const timeStartQuery = await ConversationService.getTimestampStartQueryMessage(
          conversation_id,
          userId
        )
        const messages = await MessageService.getByConversationId(
          conversation_id,
          timeStartQuery,
          skip,
          limit
        )
        res.json({
          message: 'success',
          data: messages,
        })
      } catch (error) {
        res.status(error.status || 500).json({
          status: error.status || 500,
          message: error.message || 'lỗi hệ thống',
        })
      }
    },
    getById: async (req, res) => {
      try {
        const { id } = req.params
        const message = await MessageModel.findById(id)
        if (!message) throw createError.BadRequest('update fail')
        res.json({
          status: 'success',
          data: message,
        })
      } catch (error) {
        res.status(error.status).json({ status: error.status, message: error.message })
      }
    },
    delete: async (data) => {
      try {
        const { id } = req.params
        if (!id) {
          throw createError.InternalServerError()
        }
        const res = await MessageModel.deleteOne({ _id: id })
        res.json({ status: 'success', message: 'Message deleted successfully' })
      } catch (error) {
        res.status(error.status).json({ status: error.status, message: error.message })
      }
    },
    update: async function (req, res) {
      try {
        const { id } = req.params
        const data = { ...req.body }
        delete data.id
        delete data.message_id
        const isExist = await MessageModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true })
        if (!isExist) throw createError.BadRequest('update fail')
        res.json({
          status: 'success',
          data: isExist,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
  },
}
