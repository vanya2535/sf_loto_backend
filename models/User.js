const { Schema, model } = require('mongoose')

const User = new Schema({
  username: {
    type: String,
    requried: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  roles: [
    {
      type: String,
      ref: 'Role'
    }
  ],

  balance: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = model('User', User)
