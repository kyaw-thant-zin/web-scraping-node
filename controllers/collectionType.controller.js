const asyncHnadler = require('express-async-handler')
const db = require('../models/index')

// Create main Model
const CollectionType = db.collectionTypes


// @desc GET index
// @route GET /api/v2/collection-types/index
// @access Private
const index = asyncHnadler( async (req, res) => {
    const collectionTypes = await CollectionType.findAll({attributes: ['id', 'type']})
    res.send(collectionTypes)
})

// @desc GET show
// @route GET /collection-types/:id
// @access Private
const show = asyncHnadler( async (req, res) => {
    const collectionType = await CollectionType.findOne({ where: { id: req.params.id } })
    res.send(collectionType)
})

module.exports = {
    index,
    show
}