const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

// 僅在非正式環境時，使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// set connection with mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) 

const db = mongoose.connection

db.on('error', () => {
  console.log('mongdb error!')
})

db.once('open', () => { // only happen once
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})