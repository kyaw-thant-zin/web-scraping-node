const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { index, updateLayoutType, updatelayoutContent } = require('../controllers/inputCode.controller')

router.get('/', private, index)
router.post('/layoutType/update', private, updateLayoutType)
router.post('/layoutContent/update', private, updatelayoutContent)

module.exports = router