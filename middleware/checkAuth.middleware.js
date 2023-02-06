const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models/index')
const { request } = require('express')
const asyncHnadler = require('express-async-handler')

const private = asyncHnadler( async (req, res, next) => {

    console.log(req.user)
    console.log(req.session.passport)
    if(!req.user) {
        res.json(false)
    } else {
        next()
    }

})

module.exports = { private }