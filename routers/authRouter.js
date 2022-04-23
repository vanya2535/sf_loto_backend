const Router = require('express')
const { check } = require('express-validator')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const router = new Router()

router.post(
  '/register',
  [
    check(
      'username',
      'Минимальная длина имени пользователя - 5 знаков'
    ).isLength({
      min: 5
    }),

    check(
      'username',
      'Максимальная длина имени пользователя - 10 знаков'
    ).isLength({
      max: 10
    }),

    check(
      'password',
      'Минимальная длина пароля - 8 знаков'
    ).isLength({
      min: 8
    }),

    check(
      'password',
      'Максимальная длина пароля - 16 знаков'
    ).isLength({
      max: 16
    })
  ],
  authController.register
)

router.post(
  '/login',
  [
    check(
      'username',
      'Минимальная длина имени пользователя - 5 знаков'
    ).isLength({
      min: 5
    }),

    check(
      'username',
      'Максимальная длина имени пользователя - 5 знаков'
    ).isLength({
      max: 10
    }),

    check(
      'password',
      'Минимальная длина пароля - 8 знаков'
    ).isLength({
      min: 8
    }),

    check(
      'password',
      'Максимальная длина пароля - 16 знаков'
    ).isLength({
      max: 16
    })
  ],
  authController.login
)

router.get(
  '/',
  [authMiddleware, roleMiddleware('ADMIN')],
  authController.getUsers
)

module.exports = router
