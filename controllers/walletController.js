const User = require('../models/User')

class walletContoller {
  async refill(req, res) {
    try {
      const { id } = req.user
      const { sum } = req.body
      const user = await User.findById(id)

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      user.balance += sum
      await user.save()
      return res.status(200).json({ balance: user.balance })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе пополнения кошелька' })
    }
  }

  async pay(req, res) {
    try {
      const { id } = req.user
      const { sum } = req.body
      const user = await User.findById(id)

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      if (user.balance - sum < 0) {
        return res.status(403).json({ message: 'Недостаточно средств на счету' })
      }

      user.balance -= sum
      await user.save()
      return res.status(200).json({ balance: user.balance })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе пополнения кошелька' })
    }
  }
}

module.exports = new walletContoller()
