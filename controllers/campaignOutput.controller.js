const fs = require('fs-extra')
const moment = require('moment')
const CryptoJS = require("crypto-js")
const db = require('../models/index')
const Scraper = require('../scraper/index')
const { appConfig } = require('../config/appConfig')
const { tConfig } = require('../config/tiktokConfig')
const asyncHnadler = require('express-async-handler')

// Create main Model
const Campaign = db.campaigns
const LinkType = db.linkTypes
const CampaignOutput = db.campaignOutputs
const TUser = db.tUsers
const THAshtag = db.tHashtags
const TVideo = db.tVideos

// @desc GET campaignOutput
// @route GET /api/v2/campaignOutput/
// @access Private
const index = asyncHnadler( async (req, res) => {

    const userId = 12

    if(!userId) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    
    let campaignOutputs = await Campaign.findAll({ 
        where: {
            userId: userId
        },
        include: [{
            model: CampaignOutput,
            include: [{
                model: TUser,
                include: [{
                    model: TVideo
                }]
            }, {
                model: THAshtag,
                include: [{
                    model: TVideo
                }]
            }]
        }, {
            model: LinkType
        }],
        order: [
            ['id', 'ASC'],
        ],
    })
    res.send(campaignOutputs)

})


module.exports = {
    index,
}