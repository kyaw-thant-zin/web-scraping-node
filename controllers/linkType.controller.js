const asyncHnadler = require('express-async-handler')
const db = require('../models/index')

// Create main Model
const LinkType = db.linkTypes

// @desc GET index
// @route GET /link-types/
// @access Private
const index = asyncHnadler( async (req, res) => {
    const linkTypes = await LinkType.findAll({attributes: ['id', 'type']})
    res.send(linkTypes)
})

// @desc GET show
// @route GET /link-types/:id
// @access Private
const show = asyncHnadler( async (req, res) => {
    const linkType = await LinkType.findOne({ where: { id: req.params.id } })
    res.send(linkType)
})

module.exports = {
    index,
    show
}