const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { index, store, validateUnique } = require('../controllers/campaign.controller')

router.get('/', private, index)

router.post('/store', private, store)

router.get('/validate-unique', private, validateUnique )



module.exports = router