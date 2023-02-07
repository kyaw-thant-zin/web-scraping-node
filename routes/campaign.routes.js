const express = require('express')
const router = express.Router()
const { private } = require('../middleware/checkAuth.middleware')
const { index, store, show, destroy, validateUnique, updateVisibility } = require('../controllers/campaign.controller')

router.get('/', private, index)

router.post('/store', private, store)

router.get('/:id/show', private, show)

router.post('/destroy', private, destroy)

router.get('/validate-unique', private, validateUnique )

router.post('/visibility/update', private, updateVisibility )



module.exports = router