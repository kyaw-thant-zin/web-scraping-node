const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { index } = require('../controllers/campaignOutput.controller')

router.get('/', private, index)


module.exports = router