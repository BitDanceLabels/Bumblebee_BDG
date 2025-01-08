const nodemailer = require('nodemailer')
const fs = require('fs')

const sendMail = async (toEmail, subject, text, attachments) => {
  try {
    // Cấu hình tài khoản email và SMTP server
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pqh29052003@gmail.com',
        pass: 'pqh291432'
      }
    })

    // Định nghĩa nội dung email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: toEmail,
      subject: subject,
      text: text,
      attachments: attachments.map((file) => ({
        filename: file.name,
        path: file.path
      }))
    }

    // Gửi email
    let info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = sendMail
