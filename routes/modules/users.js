const router = require('express').Router()
const passport = require('passport')
const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

router.get('/register', (req, res) => res.render('register'))

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: '此email已經註冊過' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      await User.create({
        name,
        email,
        password: hash
      })
      return res.redirect('/')
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return console.log(err)
    }
    req.flash('success_msg', '你已經成功登出')
    res.redirect('/users/login')
  })
})

module.exports = router
