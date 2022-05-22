const Router = require('express')
const { check } = require('express-validator')
const userLotteryController = require('../controllers/userLotteryController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const router = new Router()

router.post(
  '/tickets/:serial',
  [
    authMiddleware,
    roleMiddleware('USER'),

    check(
      'tickets',
      'Минимальное количество билетов для покупки - 1 билет'
    ).isLength({
      min: 1
    })
  ],
  userLotteryController.addLotteryTickets
)

router.get(
  '/',
  [authMiddleware, roleMiddleware('USER')],
  userLotteryController.getUserLotteries
)

router.get(
  '/:serial',
  [authMiddleware, roleMiddleware('USER')],
  userLotteryController.getUserLottery
)


module.exports = router
