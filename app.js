const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const Todo = require('./models/todo')

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

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

// set dynamic routes

app.get('/', (req, res) => {
  // get all todo data
  Todo.find() // find all data from Todo model
    .lean() // transfer Model in Mongoose into clean JavaScript data array
    .then(todos => res.render('index', { todos })) // send data array to index template
    .catch(error => console.error(error)) // if errors appear, catch them
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name  // get name data from req.body
  const todo = new Todo({ name })

  return todo.save()  // save in database
    .then(() => res.redirect('/')) // after adding, redirect to homepage
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})