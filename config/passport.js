const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
          const user = await User.findOne({ where: { email } })
          if (!user) {
            return done(
              null,
              false,
              req.flash('warning_msg', '驗證失敗，Email或Password錯誤')
            )
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(
              null,
              false,
              req.flash('warning_msg', '驗證失敗，Email或Password錯誤')
            )
          }
          return done(null, user)
        } catch (err) {
          console.log(err)
        }
      }
    )
  )
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json
          const user = await User.findOne({ where: { email } })
          if (user) {
            return done(null, user)
          }
          const password = bcrypt.hashSync(
            Math.random()
              .toString(36)
              .slice(-8),
            bcrypt.genSaltSync(10)
          )
          const facebookUser = await User.create({ name, email, password })
          return done(null, facebookUser)
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
      return done(null, user.dataValues)
    } catch (err) {
      console.log(err)
    }
  })
}
