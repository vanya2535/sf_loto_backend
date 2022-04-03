const { secret } = require('../config')
const jwt = require('jsonwebtoken')

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const token = req.headers.authorization?.split(' ')[1]

      if (!token) {
        return res.status(403).json({ message: 'Пользователь не авторизован' })
      }

      const { roles: userRoles } = jwt.verify(token, secret)

      if (!userRoles.some((role) => roles.includes(role))) {
        return res
          .status(403)
          .json({ message: 'У пользователя недостаточно прав' })
      }

      next()
    } catch (e) {
      console.log(e)
      return res
        .status(403)
        .json({ message: 'У пользователя недостаточно прав' })
    }
  }
}
