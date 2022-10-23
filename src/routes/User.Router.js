const express = require('express')
const { REGISTER, LOGIN, RESFRESH_TOKEN, MYINFO, GET_ALL } = require('../utils/enpoint.utils')
const router = express.Router()
const {
  register,
  login,
  refreshToken,
  myInfor,
  deleteUser,
  updateUser,
  getById,
  getAllUser,
} = require('../api/v1/user/user.controller')

router.post(`${REGISTER}`, register)
router.post(`${LOGIN}`, login)
router.post(`${RESFRESH_TOKEN}`, refreshToken)
router.get(`${MYINFO}`, myInfor)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)
router.get(`${GET_ALL}`, getAllUser)
router.get('/:id', getById)
router.get('/', (req, res) => {
  res.send('hello user')
})

module.exports = router
