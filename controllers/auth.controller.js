
const bcrypt = require('bcryptjs')
const asyncHnadler = require('express-async-handler')
const db = require('../models/index')
const { Op } = require('sequelize')
const passport = require('passport')


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

    try {
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
    } catch (error) {
        res.send(error)
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

    let foundUser = true
    if(field === 'email') {
        foundUser = await User.findOne({
            where: {
                email: val
            }
        })
        if (foundUser !== null) {
            foundUser = false
        }

    } else if(field === 'userName') {
        foundUser = await User.findOne({
            where: {
                userName: val
            }
        })
        if (foundUser !== null) {
            foundUser = false
        }
    }
    res.json(foundUser)
})

// @desc GET checkAuth
// @route GET /api/v2/check-auth
// @access Public
const checkAuth = asyncHnadler( async (req, res) => {
    const user = req.user
    const { uuid } = req.query
    if(!user) {
        res.json(false)
    } else {
        res.json(user)
    }
})

// @desc POST signIn
// @route POST /api/v2/user/sign-in
// @access Public
const signIn = asyncHnadler( async (req, res) => {
    passport.authenticate('local', (err, user) => {
        if(user === 'USER_NOT_FOUND' || user === 'WRONG_PASSWORD') {
            res.json(user)
        } else {
            req.logIn(user, function(err) {
                if(err) {
                    res.json(false)
                } else {
                    res.json(req.session.passport.user)
                }
            })
        }
    })(req, res)
    
})

// @desc POST signOut
// @route POST /api/v2/user/sign-out
// @access Public
const signOut = asyncHnadler( async (req, res) => {
    req.logout((err) => {
        if(err) {
            res.send(err)
        }
    })
    res.send(true)
})


module.exports = {
    show,
    signUp,
    validateUnique,
    checkAuth,
    signIn,
    signOut
}