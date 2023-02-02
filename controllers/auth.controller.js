
const bcrypt = require('bcryptjs')
const asyncHnadler = require('express-async-handler')
const db = require('../models/index')
const { Op } = require('sequelize')


// Create user Model
const User = db.users
const Role = db.roles

// @desc GET show
// @route GET /api/users/:id
// @access Private
const show = asyncHnadler( async (req, res) => {
    
})

// @desc POST signUp
// @route POST /api/user/sign-up
// @access Private
const signUp = asyncHnadler( async (req, res) => {

    const { firstName, lastName, tel, email, userName, password } = req.body

    console.log(firstName)
    console.log(lastName)
    console.log(tel)
    console.log(email)
    console.log(userName)
    console.log(password)
})

// @desc POST signIn
// @route POST /api/user/sign-in
// @access Private
const signIn = asyncHnadler( async (req, res) => {
    
    const cookies = req.cookies;
    const { id, password } = req.body

    console.log(cookies)
    console.log(id)
    console.log(password)
    
})


module.exports = {
    show,
    signUp,
    signIn,
}