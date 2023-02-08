const asyncHnadler = require('express-async-handler')
const db = require('../models/index')
const Scraper = require('../scraper/index')

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

    let tag = ''
    let acc = ''
    if(collectionType.value == 1) {
        tag = hashtag.replace('#', '')
        tag = '#'+tag
    } else {
        acc = account.replace('@', '')
        acc = '@'+acc
    }

    const campaignData = {
        campaignName: campaignName,
        account: acc,
        hashtag: tag,
        collectionTypeId: collectionType.value,
        linkTypeId: linkType.value,
        visibility: 0,
        userId: 12
    }

    const campaign = await Campaign.create(campaignData).then(campaigns => {
        return campaigns.get({ plain: true })
    })

    if(campaign) {

        if(campaign.collectionTypeId == 1) {
            console.log('---------------- Hashtag ------------------')
            const response = await Scraper.tiktok.getVideosByHashtag(campaign.hashtag)
            if(response) {
                console.log(response)
            } else {
                console.log('error')
            }
            
            console.log('---------------- Hashtag ------------------')
        } else {
            console.log('---------------- Hashtag ------------------')
            const response = await Scraper.tiktok.getVideosByAccount(campaign.account)
            
            console.log('---------------- Hashtag ------------------')
        }

        res.json(true)
    } else {
        res.json(false)
    }

})

// @desc POST update-visibility
// @route POST /api/v2/campaign/visibility/update
// @access Private
const updateVisibility = asyncHnadler( async (req, res) => {

    const { id, visibility } = req.body
    const userId = 12

    if(id === undefined || visibility === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    const campaign = await await Campaign.update({ visibility: visibility }, {
        where: {
            id: id,
            userId: userId
        }
    })

    if(campaign) {
        res.json(true)
    } else {
        res.json(false)
    }

})

// @desc GET show
// @route GET /api/v2/campaign/:id/show
// @access Private
const show = asyncHnadler( async (req, res) => {

    const userId = 12
    const { id } = req.params

    if(!userId && id === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let campaign = await Campaign.findOne({ 
        where: {
            userId: userId,
            id: id
        },
        include: [ CollectionType, LinkType ],
        order: [
            ['id', 'ASC'],
        ],
    })

    if(campaign) {
        res.json(campaign)
    } else {
        res.json(false)
    }
})

// @desc GET destroy
// @route GET /api/v2/campaign/destroy
// @access Private
const destroy = asyncHnadler( async (req, res) => {

    const userId = 12
    const { id } = req.body

    if(!userId && id === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let campaign = await Campaign.destroy({
        where: {
            id: id,
            userId: userId
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
    show,
    destroy,
    validateUnique,
    updateVisibility,
}