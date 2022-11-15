const express = require('express')
const { RelationShipController } = require('../api/v1/relationship/relationship.controller')
const router = express.Router()
const { verifyAccessToken } = require('../api/v1/services/jwtService')

router.get(`/get_all`, verifyAccessToken, RelationShipController.getAllFriend)
router.post(`/send_request/`, verifyAccessToken, RelationShipController.sendRequest)
router.post(`/accept_request/`, verifyAccessToken, RelationShipController.acceptRequest)

module.exports = router
