
const bcrypt = require('bcryptjs')
const asyncHnadler = require('express-async-handler')
const db = require('../models/index')
const { Op } = require('sequelize')


// Create user Model
const User = db.users
const Role = db.roles

// @desc GET show
// @route GET /api/v2/user/:id
// @access Private
const show = asyncHnadler( async (req, res) => {
    
})

// @desc POST signUp
// @route POST /api/v2/user/sign-up
// @access Public
const signUp = asyncHnadler( async (req, res) => {

    const { firstName, lastName, tel, email, userName, password } = req.body

    if(!firstName || !lastName || !userName || !email || !password) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate remember token
    const rememberToken = await bcrypt.hash(userName, salt)
    const resetToken = await bcrypt.hash(email, salt)

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        tel: tel,
        userName: userName,
        password: hashedPassword,
        status: 1,
        roleId: 3,
        userTypeId: 1,
        rememberToken: rememberToken,
        resetToken: resetToken
    }

    // Create user
    const user = await User.create(userData).catch(error => {console.log(error)}) 

    if(user) {
        res.status(201).json(true)
    } else {
        res.status(201).json(false)
    }
})

// @desc GET validateUnique
// @route GET /api/v2/user/sign-up/validate-unique
// @access Public
const validateUnique = asyncHnadler( async (req, res) => {

    const { field, val } = req.query

    if(!field || !val) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let foundUser = false
    if(field === 'email') {
        foundUser = await User.findOne({
            where: {
                email: val
            }
        })
        if (foundUser !== null || foundUser !== false) {
            foundUser = true
        }

    } else if(field === 'userName') {
        foundUser = await User.findOne({
            where: {
                userName: val
            }
        })
        if (foundUser !== null || foundUser !== false) {
            foundUser = true
        }
    }
    res.json(foundUser)
})

// @desc POST signIn
// @route POST /api/v2/user/sign-in
// @access Public
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
    validateUnique,
    signIn,
}