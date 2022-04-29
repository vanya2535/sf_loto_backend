const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routers/authRouter')
const walletRouter = require('./routers/walletRouter')
const userLotteryRouter = require('./routers/userLotteryRouter')
const lotteryRouter = require('./routers/lotteryRouter')

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: '*'
}

const app = express()

const PORT = process.env.PORT || 3000
const DB_URL =
  'mongodb+srv://vanya2535:D2ASwllzxHxif9eB@cluster0.2ashg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.use(express.json())
app.use(cors(corsOptions))

app.use('/auth', authRouter)
app.use('/wallet', walletRouter)
app.use('/user-lottery', userLotteryRouter)
app.use('/lottery', lotteryRouter)

async function start() {
  try {
    await mongoose.connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })

    app.listen(PORT, () => {
      console.log(`Server listen on https://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
