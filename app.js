const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const passport = require('passport')
const usePassport = require('./config/passport')
const app = express()
const port = 3000
const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: false
  })
)
usePassport(app)

app.get('/', async (req, res) => {
  try {
    let todos = await Todo.findAll()
    todos = todos.map(todo => todo.dataValues)
    return res.render('index', { todos: todos })
  } catch (err) {
    return res.status(422).json(err)
  }
})
app.get('/todos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id)
    return res.render('detail', { todo: todo.dataValues })
  } catch (err) {
    return console.log(err)
  }
})

app.get('/users/login', (req, res) => res.render('login'))
app.get('/users/register', (req, res) => res.render('register'))
app.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)
app.post('/users/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ where: email })
    if (user) {
      console.log('user already exists')
      return res.render('register', { name, email, password, confirmPassword })
    }
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    return res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})
app.get('/users/logout', (req, res) => res.render('login'))

app.listen(port, () => console.log(`app is running on port:${port}`))
