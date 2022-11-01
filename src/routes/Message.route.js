const express = require('express')
const router = express.Router()
const { MessageController } = require('../api/v1/message/message.controller')
const { verifyAccessToken, verifyRefreshAccessToken } = require('../api/v1/services/jwtService')

router.get(`/by_conversation_id/:conversation_id`, MessageController.getByConversationId)

module.exports = router