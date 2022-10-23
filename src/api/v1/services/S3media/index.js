const cloudinary = require('cloudinary')
const fs = require('fs')
const { UserService } = require('../../user/user.service')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err
  })
}

module.exports = {
  MediaService: {
    upload: async (req, res, next) => {
      try {
        const file = req?.files?.formAvatar
        if (!file) throw new Error()
        await cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { folder: 'yummy/avatar' },
          (error, result) => {
            if (error) throw error
            removeTmp(file.tempFilePath)
            res.json({ data: result, message: 'upload file success' })
          }
        )
      } catch (error) {
        res.status(400).json({ status: false, message: 'upload file fail' })
      }
    },
  },
}
