const asyncHnadler = require('express-async-handler')
const db = require('../models/index')

// Create main Model
const Campaign = db.campaigns
const CollectionType = db.collectionTypes
const LinkType = db.linkTypes

// @desc GET validateUnique
// @route GET /api/v2/campaign/validate-unique
// @access Private
const validateUnique = asyncHnadler( async (req, res) => {

    const { campaignName } = req.query

    if(!campaignName) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let foundCampaignName = await Campaign.findOne({
        where: {
            campaignName: campaignName,
            userId: 12
        }
    })

    if (foundCampaignName !== null) {
        foundCampaignName = false
    } else {
        foundCampaignName = true
    }

    res.json(foundCampaignName)
})


// @desc GET index
// @route GET /api/v2/campaign
// @access Private
const index = asyncHnadler( async (req, res) => {

    const userId = 12

    if(!userId) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let campaigns = await Campaign.findAll({ 
        where: {
            userId: userId
        },
        include: [ CollectionType, LinkType ],
        order: [
            ['id', 'ASC'],
        ],
    })

    res.send(campaigns)
})

// @desc GET store
// @route GET /api/v2/campaign/store
// @access Private
const store = asyncHnadler( async (req, res) => {

    const { campaignName, collectionType, account, hashtag, linkType } = req.body

    if(!campaignName || !collectionType || !linkType) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    const campaignData = {
        campaignName: campaignName,
        account: account,
        hashtag: hashtag,
        collectionTypeId: collectionType.value,
        linkTypeId: linkType.value,
        visibility: 0,
        userId: 12
    }

    const campaign = await Campaign.create(campaignData).then(campaigns => {
        return campaigns.get({ plain: true })
    })

    if(campaign) {
        res.json(true)
    } else {
        res.json(false)
    }

})

// @desc GET update-visibility
// @route GET /api/v2/campaign/visibility/update
// @access Private
const updateVisibility = asyncHnadler( async (req, res) => {

    const { id, visibility } = req.body

    if(id === undefined || visibility === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    const campaign = await await Campaign.update({ visibility: visibility }, {
        where: {
            id: id,
        }
    })

    if(campaign) {
        res.json(true)
    } else {
        res.json(false)
    }

})

module.exports = {
    index,
    store,
    validateUnique,
    updateVisibility,
}