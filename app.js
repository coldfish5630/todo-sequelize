const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const port = 3000
const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => res.send('Hello World'))

app.get('/users/login', (req, res) => res.render('login'))
app.get('/users/register', (req, res) => res.render('register'))
app.post('/users/login', (req, res) => res.send('login'))
app.post('/users/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  await User.create({ name, email, password })
  res.redirect('/')
})
app.get('/users/logout', (req, res) => res.render('login'))

app.listen(port, () => console.log(`app is running on port:${port}`))
