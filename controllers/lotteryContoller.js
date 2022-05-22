const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')
const Lottery = require('../models/Lottery')
const paginationService = require('../services/paginationService')

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function handleLotteryState(lottery) {
  if (lottery.status === 'waiting' && Date.now() > lottery.startDate) {
    lottery.status = 'started'
  }

  if (lottery.status === 'started' && Date.now() > lottery.finishDate) {
    lottery.status = 'finished'

    for (let prize of lottery.prizes) {
      const tickets = [...Array(lottery.ticketsCount).keys()]

      const winningTicket = {
        number: tickets[getRandomInt(lottery.ticketsCount - 1)],
        prize
      }

      lottery.winningTickets.push(winningTicket)
    }
  }
}

class lotteryContoller {
  async createLottery(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    try {
      const {
        title,
        description,
        prizes,
        ticketCost,
        ticketsCount,
        startDate,
        finishDate
      } = req.body

      if (startDate && startDate < Date.now()) {
        return res.status(400).json({ message: 'Выберите более позднее время для начала лотереи' })
      }

      if (finishDate && startDate > finishDate || finishDate && finishDate < Date.now()) {
        return res.status(400).json({ message: 'Выберите более позднее время для завершения лотереи' })
      }
      
      if (prizes?.length > ticketsCount) {
        return res.status(400).json({ message: 'Добавьте больше билетов в лотерею' })
      }

      const lottery = new Lottery({
        serial: uuid(),
        title,
        description,
        prizes,
        ticketCost,
        ticketsCount,
        startDate: startDate || Date.now() + 3600000,
        finishDate: finishDate || Date.now() + 7200000
      })

      await lottery.save()
      return res.status(200).json(lottery)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе создания лотереи' })
    }
  }

  async deleteLottery(req, res) {
    try {
      const { serial } = req.params

      const lottery = await Lottery.find({ serial })

      if (!lottery) {
        return res.status(400).json({ message: 'Лотерея не найдена' })
      }

      await Lottery.deleteOne({ serial })
      return res.status(200).json({ serial })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе удаления лотереи' })
    }
  }

  async getLotteries(req, res) {
    try {
      const { page, perPage } = req.query

      const lotteries = await Lottery.find()
        .sort('-startDate')
        .skip((perPage || 20) * (page - 1 || 0))
        .limit(perPage || 20)

      for (let lottery of lotteries) {
        handleLotteryState(lottery)
        await Lottery.findOneAndUpdate({ serial: lottery.serial }, lottery)
      }

      const count = await Lottery.count()

      return res
        .status(200)
        .set(paginationService.getPaginationHeaders(count, page, perPage))
        .json(lotteries)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе получения списка лотерей' })
    }
  }

  async getLotteryState(req, res) {
    try {
      const { serial } = req.params
      const lottery = await Lottery.findOne({ serial })
      
      if (!lottery) {
        return res.status(400).json({ message: 'Лотерея не найдена' })
      }

      handleLotteryState(lottery)
      await Lottery.findOneAndUpdate({ serial: lottery.serial }, lottery)

      return res.status(200).json(lottery)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'Ошибка в процессе получения данных лотереи' })
    }
  }
}

module.exports = new lotteryContoller()
