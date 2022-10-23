const nodemailer = require('nodemailer')
require('dotenv').config()

function sendMail(data) {
  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILNAME,
      pass: process.env.MAILPASS,
    },
  })

  // Setting credentials
  let mailDetails = {
    from: '<your-email>@gmail.com',
    to: data.email,
    subject: 'Test mail using Cron job',
    text: 'Node.js cron job email' + ' testing for GeeksforGeeks',
  }

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log('Error Occurs', err)
    } else {
      console.log('Email sent successfully')
    }
  })
}
