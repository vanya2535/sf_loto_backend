const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('../config')

const generateAccessToken = (id, roles) => {
  return jwt.sign({ id, roles }, secret, { expiresIn: '24h' })
}

class authController {
  async register(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json(errors)
      }

      const { username, password, role } = req.body
      const candidate = await User.findOne({ username })

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Пользователь с таким именем уже зарегистрирован' })
      }

      const hashPassword = bcrypt.hashSync(password, 7)
      const userRole =
        (await Role.findOne({ value: role })) ||
        (await Role.findOne({ value: 'USER' }))

      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value]
      })

      await user.save()

      const token = generateAccessToken(user._id, user.roles)

      return res.json({
        token,
        user: {
          id: user._id,
          username,
          roles: user.roles,
          balance: user.balance
        }
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе регистрации' })
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const validPassword = bcrypt.compareSync(password, user.password)

      if (!validPassword) {
        return res.status(400).json({ message: 'Неверный пароль' })
      }

      const token = generateAccessToken(user._id, user.roles)

      return res.json({
        token,
        user: {
          id: user._id,
          username,
          roles: user.roles,
          balance: user.balance
        }
      })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе входа' })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      return res.json(users)
    } catch (e) {
      console.log(e)
      return res
        .status(400)
        .json({ message: 'Ошибка в процессе получения данных' })
    }
  }

  async getData(req, res) {
    try {
      const { token } = req.query

      if (!token) {
        return res.status(403).json({ message: 'Пользователь не авторизован' })
      }

      const { secret } = require('../config')
      const { id } = jwt.verify(token, secret)

      const user = await User.findById(id)

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          roles: user.roles,
          balance: user.balance
        }
      })
    } catch (e) {
      console.log(e)
      return res
        .status(400)
        .json({ message: 'Ошибка в процессе получения данных' })
    }
  }
}

module.exports = new authController()
