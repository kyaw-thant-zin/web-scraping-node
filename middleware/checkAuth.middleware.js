const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../models/index')
const { request } = require('express')
const asyncHnadler = require('express-async-handler')

const private = asyncHnadler( async (req, res, next) => {
    if(!req.user) {
        console.log('not auth')
        res.json({
            error: 'RQAUTH'
        })
        return
    }

    next()
    return
})

module.exports = { private }