const CryptoJS = require("crypto-js")
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const db = require('../models/index')

// Create user Model
const User = db.users
const screctKey = 'webapp0.2'

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
                    if(key === 'uuid') {
                        filteredUser[key] = CryptoJS.AES.encrypt(user.dataValues[key], screctKey).toString()
                    } else {
                        filteredUser[key] = user.dataValues[key]
                    }
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
        const decryptedUUID = CryptoJS.AES.decrypt(user.uuid, screctKey).toString(CryptoJS.enc.Utf8)
        const users = await User.findOne({
            where: {
                uuid: decryptedUUID
            }
        })
        if (!users) {
            done(null, false)
        }
        done(null, user)
    })
}