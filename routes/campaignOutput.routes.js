const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { index, updateLink, updateVisibility, updatePriority } = require('../controllers/campaignOutput.controller')

router.get('/', private, index)
router.post('/link/update', private, updateLink)
router.post('/priority/update', private, updatePriority)
router.post('/visibility/update', private, updateVisibility)


module.exports = router