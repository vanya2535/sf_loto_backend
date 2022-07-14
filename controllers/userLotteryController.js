const { validationResult } = require('express-validator')
const User = require('../models/User')
const Lottery = require('../models/Lottery')
const UserLottery = require('../models/UserLottery')
const paginationService = require('../services/paginationService')

class userLotteryContoller {
  async addLotteryTickets(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    try {
      const { id } = req.user
      const user = await User.findById(id)
      
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const { serial } = req.params
      const { tickets } = req.body
      const lottery = await Lottery.findOne({ serial })
      
      if (!lottery) {
        return res.status(400).json({ message: 'Лотерея не найдена' })
      }

      if (lottery.status === 'waiting') {
        return res.status(400).json({ message: 'Лотерея еще не началась' })
      }

      if (lottery.status === 'finished') {
        return res.status(400).json({ message: 'Лотерея закончилась' })
      }

      if (tickets.some((ticket) => lottery.ownedTickets.includes(ticket))) {
        return res.status(400).json({ message: 'Один или несколько выбранных билетов уже куплены' })
      }

      let userLottery = await UserLottery.findOne({ user: id, serial })

      if (!userLottery) {
        userLottery = new UserLottery({ user: id, serial })
      }
      
      userLottery.tickets = userLottery.tickets.concat(tickets)
      await userLottery.save()
      
      lottery.ownedTickets = lottery.ownedTickets.concat(tickets)
      await lottery.save()

      return res.status(200).json(lottery)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе начисления лотерейных билетов' })
    }
  }

  async getUserLotteries(req, res) {
    try {
      const { id } = req.user
      const user = await User.findById(id)
      
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const { page, perPage } = req.query

      const lotteries = await UserLottery.find({ user: id })
        .skip((perPage || 20) * (page - 1 || 0))
        .limit(perPage || 20)

      const count = await UserLottery.count({ user: id })

      return res
        .status(200)
        .set(paginationService.getPaginationHeaders(count, page, perPage))
        .json(lotteries)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе получения информации о лотереях пользователя' })
    }
  }

  async getUserLottery(req, res) {
    try {
      const { id } = req.user
      const user = await User.findById(id)
      
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const serial = req.params.serial

      const lottery = await UserLottery.findOne({ user: id, serial })

      return res
        .status(200)
        .json(lottery)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе получения информации о лотерее' })
    }
  }
}

module.exports = new userLotteryContoller()