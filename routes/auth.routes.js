const express = require('express')
const router = express.Router()
const { show, signIn, signUp, validateUnique } = require('../controllers/auth.controller')

router.get('/show/:id', show)

router.post('/sign-up', signUp )

router.post('/sign-in', signIn )

router.get('/sign-up/validate-unique', validateUnique)



module.exports = router