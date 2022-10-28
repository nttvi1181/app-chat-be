const createError = require('http-errors')
const { User } = require('./user.model')
const bcrypt = require('bcrypt')
const { userValidate, userValidateLogin } = require('./user.validation')
const { UserService } = require('./user.service')
const { INVALID_LOGIN } = require('../../../constant/errorType.constant')
const { signAccessToken, signRefreshAccessToken } = require('../services/jwtService')
module.exports = {
  register: async function (req, res) {
    try {
      const { phone, email } = req.body
      const { error } = userValidate(req.body)
      if (error) {
        console.log('LOG === REGISTER ==> ERROR', error)
        throw createError.BadRequest()
      }
      console.log('LOG === REGISTER ==>', JSON.stringify(req.body))
      const isExist = await User.findOne({ phone }).exec()
      if (isExist) {
        throw createError.Conflict('phone is ready')
      }
      const dataRegister = req.body
      delete dataRegister?.confirm_password
      const user = await UserService.create(dataRegister)
      if (!user) throw createError.InternalServerError()
      const accessToken = await signAccessToken(user._id)
      const refreshAccessToken = await signRefreshAccessToken(user._id)
      res.json({
        status: 'success',
        massage: 'registed',
        data: {
          accessToken,
          refreshAccessToken,
        },
      })
    } catch (error) {
      res.status(error.status || 400).json({ status: error.status, message: error.message })
    }
  },
  login: async function (req, res) {
    try {
      const { phone, password } = req.body
      const { error } = userValidateLogin(req.body)
      if (error) throw createError.BadRequest()

      const user = await UserService.findOne({ phone })
      if (!user) throw createError.Conflict('account not exist')
      const checkPass = await user.isCheckPass(password)
      //@todo after register
      // if (!checkPass) {
      //   throw createError.Unauthorized()
      // }
      const accessToken = await signAccessToken(user._id)
      const refreshAccessToken = await signRefreshAccessToken(user._id)
      res.json({
        status: 'success',
        data: { accessToken, refreshAccessToken },
      })
    } catch (error) {
      res.status(error.status || 400).json({ status: INVALID_LOGIN, message: error.message })
    }
  },
  updateUser: async function (req, res) {
    try {
      const { id } = req.params
      const data = { ...req.body }
      delete data.id
      const { error } = userValidateUpdate(req.body)
      const { password } = data
      if (password) {
        const salt = await bcrypt.genSalt()
        delete data.password
        data.password = await bcrypt.hash(password, salt)
      }
      if (error) throw createError.BadRequest()
      const newUser = await UserService.update(id, data)
      if (!newUser) throw createError.BadRequest('update fail')
      res.json({
        status: 'success',
        data: newUser,
      })
    } catch (error) {
      res.status(error.status || 400).json({ status: error.status, message: error.message })
    }
  },
  deleteUser: async function (req, res) {
    try {
      const { id } = req.query
      if (!id) {
        throw createError.InternalServerError()
      }
      const res = await UserService.delete(id)
      if (res) {
        return res.json({ status: 'success', message: 'User deleted successfully' })
      }
      throw createError.InternalServerError()
    } catch (error) {
      res.status(error.status).json({ status: error.status, message: error.message })
    }
  },

  myInfor: async function (req, res) {
    try {
      const { userId } = req
      if (!userId) {
        throw createError.Unauthorized()
      }
      const user = await await UserService.getById(userId)
      if (user) {
        res.json({ status: 'success', data: user })
      } else {
        throw createError.InternalServerError()
      }
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },

  getAllUser: async (req, res) => {
    try {
      let conditions = req.query
      let skip = 0
      let limit = 9999
      if (req.query.limit) {
        limit = req.query.limit
      }
      if (req.query.skip) {
        skip = req.query.skip
      }
      delete conditions.limit
      delete conditions.skip
      if (!conditions) {
        conditions = {}
      }
      const users = await UserService.getAll(conditions, skip, limit)
      res.json({ status: 'success', data: users })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  getById: async (req, res) => {
    try {
      const { userId } = req.query
      const { id } = req.params
      if (!userId && !id) {
        throw new Error()
      }
      const user = await UserService.getById(userId || id)
      res.json({ status: 'success', data: user })
    } catch (error) {
      res.status(error.status || 500).json({ status: error.status || 500, message: error.message })
    }
  },
  refreshToken: async function (req, res) {
    try {
      const { userId } = req
      if (!userId) {
        throw createError.Authorization()
      }
      const accessToken = await signAccessToken(userId)
      const refreshAccessToken = await signRefreshAccessToken(userId)

      res.json({
        status: 'success',
        data: { accessToken, refreshAccessToken },
      })
    } catch (error) {
      res
        .status(error.status || 401)
        .json({ status: INVALID_REFRESH_TOKEN, message: error.message })
    }
  },
}
