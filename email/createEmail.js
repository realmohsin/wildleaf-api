const createEmail = (emailAddress, type, { passwordResetURL }) => {
  if (type === 'password-reset') {
    const message = `Forgot your password? Submit a PATCH request with your new password to ${passwordResetURL}.\nIf you didn't forget your password, ignore this email!`
    const email = {
      from: 'Real Mohsin <hello@mohsin.io>',
      to: emailAddress,
      subject: 'Your password reset token (valid for 10min)',
      text: message
      // html:
    }
    return email
  }
}

module.exports = createEmail
