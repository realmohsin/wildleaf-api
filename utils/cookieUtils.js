const addSessionCookie = (res, token) => {
  const { JWT_COOKIE_EXPIRES_IN, NODE_ENV } = process.env
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if (NODE_ENV === 'production') {
    ;(cookieOptions.secure = true), (cookieOptions.sameSite = true)
  }
  res.cookie('sessionToken', token, cookieOptions)
}

const clearSessionCookie = res => {
  res.clearCookie('sessionToken')
}

module.exports = { addSessionCookie, clearSessionCookie }
