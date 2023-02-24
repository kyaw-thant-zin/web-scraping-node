const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { index, store } = require('../controllers/linkSetting.controller')

router.get('/', private, index)

router.post('/store', private, store)



module.exports = router