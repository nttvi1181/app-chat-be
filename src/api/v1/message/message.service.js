const { MessageModel } = require('./message.model')

module.exports = {
  MessageService: {
    create: async (data) => {
      try {
        const newRecord = new MessageModel(data)
        const result = await newRecord.save()
        return result
      } catch (error) {
        throw new Error(error)
      }
    },

    update: async (id, data) => {
      try {
        const newRecord = await MessageModel.findOneAndUpdate(
          { _id: id },
          { $set: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    delete: async (id) => {
      try {
        await MessageModel.deleteOne({ _id: id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },

    findOne: async (conditions) => {
      try {
        const record = await MessageModel.findOne(conditions).exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getAll: async (conditions, skip = 0, limit = 9999999) => {
      try {
        const records = await MessageModel.find(conditions).skip(skip).limit(limit)
        return records
      } catch (error) {
        throw new Error(error)
      }
    },

    getById: async (id) => {
      try {
        const record = await MessageModel.findOne({ _id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
