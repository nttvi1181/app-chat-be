const createError = require('http-errors')
const { RelationService } = require('./relationship.service')

module.exports = {
  RelationShipController: {
    getAllRequestRecived: async (req, res, next) => {
      try {
        const { userId } = req
        const records = await RelationService.getAll({
          $and: [{ recive_id: userId }, { status: 'pending' }],
        })
        res.json({
          status: 'success',
          data: records,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
    getAllRequestSended: async (req, res, next) => {
      try {
        const { userId } = req
        const records = await RelationService.getAll({
          $and: [{ sender_id: userId }, { status: 'pending' }],
        })
        res.json({
          status: 'success',
          data: records,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
    sendRequest: async (req, res, next) => {
      try {
        const { userId } = req
        const { recive_id } = req.body
        const records = await RelationService.create(userId, recive_id)
        res.json({
          status: 'success',
          data: records,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
    acceptRequest: async (req, res, next) => {
      try {
        const { userId } = req
        const { sender_id } = req.body
        const record = await RelationService.updateByDataRecord(sender_id, userId, {
          status: 'accepted',
        })
        res.json({
          status: 'success',
          data: record,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
    rejectRequest: async (req, res, next) => {
      try {
        const { userId } = req
        const { sender_id } = req.body
        const record = await RelationService.deleteByDataRecord(sender_id, userId)
        res.json({
          status: 'success',
          data: record,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
    getAllFriend: async (req, res, next) => {
      try {
        const { userId } = req
        const records = await RelationService.getAll({
          $and: [{ $or: [{ recive_id: userId }, { sender_id: userId }] }, { status: 'accepted' }],
        })
        res.json({
          status: 'success',
          data: records,
        })
      } catch (error) {
        res.status(error.status || 400).json({ status: error.status, message: error.message })
      }
    },
  },
}
