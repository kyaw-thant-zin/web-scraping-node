const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { campaignVideos } = require('../controllers/cdn.controller.js')

router.get('/campaign/videos', campaignVideos)



module.exports = router