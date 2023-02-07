const express = require('express')
const router = express.Router()
const { index, show } = require('../controllers/linkType.controller')
const { private } = require('../middleware/checkAuth.middleware')

router.get('/', private, index)
router.get('/show/:id', private, show)

module.exports = router