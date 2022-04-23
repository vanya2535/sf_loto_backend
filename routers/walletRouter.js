const Router = require('express')
const walletContoller = require('../controllers/walletController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const sumMiddleware = require('../middleware/sumMiddleware')

const router = new Router()

router.post(
  '/refill',
  [authMiddleware, roleMiddleware('USER'), sumMiddleware],
  walletContoller.refill
)

router.post(
  '/pay',
  [authMiddleware, roleMiddleware('USER'), sumMiddleware],
  walletContoller.pay
)


module.exports = router
