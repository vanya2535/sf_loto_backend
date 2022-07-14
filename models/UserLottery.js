const { model, Schema } = require('mongoose')

const UserLottery = new Schema({
  user: {
    type: String,
    required: true,
    ref: 'User'
  },

  serial: {
    type: String,
    required: true,
    ref: 'Lottery'
  },

  tickets: {
    type: [Number],
    required: true,
    default: []
  }
})

module.exports = model('UserLottery', UserLottery)
