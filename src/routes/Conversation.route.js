const express = require('express')
const router = express.Router()
const {
  getMyConversations,
  memberDeleteConversation,
  getByConversationId,
} = require('../api/v1/conversation/conversation.controller')
const { verifyAccessToken, verifyRefreshAccessToken } = require('../api/v1/services/jwtService')

router.get(`/all_conversations`, verifyAccessToken, getMyConversations)
router.post('/member_delete', verifyAccessToken, memberDeleteConversation)
router.get('/:conversation_id', verifyAccessToken, getByConversationId)

module.exports = router
