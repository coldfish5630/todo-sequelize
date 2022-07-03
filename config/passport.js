const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          console.log(email)
          const user = await User.findOne({ where: { email } })
          if (!user) {
            return done(null, false, {
              message: 'that email is not registered'
            })
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'email or password incorrect' })
          }
          return done(null, user)
        } catch (err) {
          console.log(err)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id)
      done(null, user.dataValues)
    } catch (err) {
      console.log(err)
    }
  })
}
