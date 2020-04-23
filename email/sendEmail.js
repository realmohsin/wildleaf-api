const nodemailer = require('nodemailer')

const sendEmail = async email => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // activate in gmail 'less secure app' option
    // gmail is not good for production, has outgoing email limits
  })
  // 2) Define the email options
  // const formattedEmail = {
  //   from: 'Real Mohsin <hello@mohsin.io>',
  //   to: email.to,
  //   subject: email.subject,
  //   text: email.message
  //   // html:
  // }
  // 3) Send the email
  await transporter.sendMail(email)
}

module.exports = sendEmail
