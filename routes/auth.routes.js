const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { show, signIn, signUp, validateUnique, checkAuth, signOut } = require('../controllers/auth.controller')

router.get('/check-auth', private, checkAuth)

router.get('/show/:id', show)

router.post('/sign-up', signUp )

router.post('/sign-in', signIn )

router.post('/sign-out', signOut )

router.get('/sign-up/validate-unique', validateUnique)



module.exports = router