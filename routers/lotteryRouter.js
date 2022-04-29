const Router = require('express')
const { check } = require('express-validator')
const lotteryContoller = require('../controllers/lotteryContoller')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const router = new Router()

router.post(
  '/create',
  [
    authMiddleware,
    roleMiddleware('ADMIN'),

    check(
      'title',
      'Минимальная длина заголовка - 6 символов'
    ).isLength({
      min: 6
    }),

    check(
      'title',
      'Максимальная длина заголовка - 64 символа'
    ).isLength({
      max: 64
    }),

    check(
      'description',
      'Минимальная длина описания - 10 символов'
    ).isLength({
      min: 10
    }),

    check(
      'description',
      'Максимальная длина описания - 256 символов'
    ).isLength({
      max: 265
    })
  ],
  lotteryContoller.createLottery
)

router.delete(
  '/delete/:serial',
  [authMiddleware, roleMiddleware('ADMIN')],
  lotteryContoller.deleteLottery
)

router.get(
  '/',
  lotteryContoller.getLotteries
)

router.get(
  '/:serial',
  lotteryContoller.getLotteryState
)

module.exports = router
