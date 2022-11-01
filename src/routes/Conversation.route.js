const express = require('express')
const router = express.Router()
const { getMyConversations } = require('../api/v1/conversation/conversation.controller')
const { verifyAccessToken, verifyRefreshAccessToken } = require('../api/v1/services/jwtService')

router.get(`/all_conversations`, verifyAccessToken, getMyConversations)

module.exports = router
