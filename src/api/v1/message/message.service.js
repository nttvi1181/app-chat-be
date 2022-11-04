const { ConversationService } = require('../conversation/conversation.service')
const { MessageModel } = require('./message.model')
const { validateMessage } = require('./message.validation')

module.exports = {
  MessageService: {
    create: async (data) => {
      try {
        const { error } = validateMessage(data)
        if (error) throw new Error(error)
        const isExistConversation = ConversationService.checkIsExistByConversationId(
          data.conversation_id
        )
        if (!isExistConversation) {
          throw createError.BadRequest()
        }
        const newRecord = new MessageModel(data)
        const result = await newRecord.save()
        await result.populate('sender_id', 'username _id avatar_url')
        return result
      } catch (error) {
        console.log('Error insert message')
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
    getByConversationId: async (id, timeStart, skip = 0, limit = 20) => {
      try {
        const record = await MessageModel.find({
          conversation_id: id,
          send_time: { $gt: timeStart },
        })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('sender_id', 'username _id avatar_url')
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    checkIsSeenMessage: async (message_id, user_id) => {
      try {
        const record = await MessageModel.findOne({ message_id, member_seens: user_id })
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    UpdateSeenMessage: async (message_id, user_id) => {
      try {
        const record = await MessageModel.findOneAndUpdate(
          {
            message_id,
          },
          { $push: { member_seens: user_id } },
          { new: true }
        )
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    checkIsReactionMessage: async (message_id, user_id) => {
      try {
        const record = await MessageModel.findOne({
          message_id: message_id,
          'reactions.userId': user_id,
        })
        return record
      } catch (error) {
        throw new Error(error)
      }
    },
    updateReactionMessage: async (message_id, user_id, type) => {
      try {
        const record = await MessageModel.findOne({
          message_id: message_id,
          'reactions.userId': user_id,
        })
        if (!record) {
          await MessageModel.updateOne(
            { message_id: message_id },
            {
              $push: {
                reactions: {
                  userId: user_id,
                  type,
                },
              },
            },
            { new: true }
          )
          return [
            {
              userId: user_id,
              type,
            },
          ]
        }
        const reaction = record.reactions.find((item) => item.userId === user_id)
        if (reaction.type === type) {
          newReactions = record.reactions.filter((item) => item.userId !== user_id)
        } else {
          newReactions = record.reactions.map((item) => {
            if (item.userId === user_id) {
              return {
                ...item,
                type,
              }
            }
            return item
          })
        }
        await MessageModel.updateOne(
          { message_id: message_id, 'reactions.userId': user_id },
          {
            $set: {
              reactions: newReactions,
            },
          },
          { new: true }
        )
        return newReactions
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
