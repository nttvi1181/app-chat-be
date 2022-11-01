const { Conversation } = require('./conversation.model')

module.exports = {
  ConversationService: {
    create: async (data) => {
      try {
        const newRecord = new Conversation(data)
        const result = await newRecord.save()
        return result
      } catch (error) {
        throw new Error(error)
      }
    },

    update: async (id, data) => {
      try {
        const newRecord = await Conversation.findOneAndUpdate(
          { _id: id },
          { $set: { ...data } },
          { new: true }
        )
        return newRecord
      } catch (error) {
        throw new Error(error)
      }
    },

    updateByConversationId: async (id, data) => {
      try {
        const newRecord = await Conversation.findOneAndUpdate(
          { conversation_id: id },
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
        await Conversation.deleteOne({ _id: id })
        return true
      } catch (error) {
        throw new Error(error)
      }
    },

    findOne: async (conditions) => {
      try {
        const record = await Conversation.findOne(conditions).exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getAll: async (conditions, skip = 0, limit = 9999999) => {
      try {
        const records = await Conversation.find(conditions).skip(skip).limit(limit)
        return records
      } catch (error) {
        throw new Error(error)
      }
    },

    getById: async (id) => {
      try {
        const record = await Conversation.findOne({ _id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    getByConversationId: async (id) => {
      try {
        const record = await Conversation.findOne({ conversation_id: id }).lean().exec()
        return record
      } catch (error) {
        throw new Error(error)
      }
    },

    checkIsExistByConversationId: async (conversation_id) => {
      try {
        const record = await Conversation.findOne({ conversation_id: conversation_id })
          .lean()
          .exec()
        if (record) return true
        return false
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
