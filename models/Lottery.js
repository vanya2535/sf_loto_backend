const { v4: uuid } = require('uuid')
const { model, Schema } = require('mongoose')

const Lottery = new Schema({
  status: {
    type: String,
    requried: true,
    default: 'waiting'
  },

  serial: {
    type: String,
    required: true,
    unique: true,
    default: uuid()
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  prizes: {
    type: [Number],
    required: true,
    default: [1500, 3000, 5000]
  },

  ticketCost: {
    type: Number,
    requried: true,
    default: 150
  },

  ticketsCount: {
    type: Number,
    required: true,
    default: 100
  },

  ownedTickets: {
    type: [Number],
    required: true,
    default: []
  },

  winningTickets: {
    type: [Object],
    required: true,
    default: []
  },

  startDate: {
    type: Number,
    requried: true,
    default: Date.now() + 3600000
  },

  finishDate: {
    type: Number,
    required: true,
    default: Date.now() + 7200000
  }
})

module.exports = model('Lottery', Lottery)
