const bcrypt = require("bcryptjs")
const { Op } = require('sequelize')
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const db = require('../models/index')

// Create user Model
const User = db.users

module.exports.passportConfig = () => {
    passport.use(
      new LocalStrategy(
        { usernameField: "userName", passwordField: "password" },
        async (userName, password, done) => {
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { userName: userName },
                        { email: userName }
                    ]
                }
            })
            if (!user) {
                return done(null, 'USER_NOT_FOUND')
            }
            if (!await bcrypt.compare(password, user.password)) {
                return done(null, 'WRONG_PASSWORD')
            }

            const filteredUser = {}
            for(const key in user.dataValues) {
                if(key === 'uuid' || key === 'userName' || key === 'roleId' || key === 'firstName' || key === 'lastName' ) {
                    filteredUser[key] = user.dataValues[key]
                }
            }

            return done(null, filteredUser)
        }
      )
    )
  
    passport.serializeUser((user, done) => {
        done(null, user)
    })
  
    passport.deserializeUser(async (user, done) => {
        const users = await User.findOne({
            where: {
                uuid: user.uuid
            }
        })
        if (!users) {
            done(error, false)
        }
        done(null, user)
    })
}