const fs = require('fs-extra')
const moment = require('moment')
const CryptoJS = require("crypto-js")
const db = require('../models/index')
const uuid = require('uuid')
const Scraper = require('../scraper/index')
const { appConfig } = require('../config/appConfig')
const { tConfig } = require('../config/tiktokConfig')
const asyncHnadler = require('express-async-handler')
const { Op } = require('sequelize')

// Create main Model
const TUser = db.tUsers
const TVideo = db.tVideos
const Campaign = db.campaigns
const THashtag = db.tHashtags
const LinkSetting = db.linkSettings

// @desc GET index
// @route GET /api/v2/linkSetting
// @access Private
const index = asyncHnadler( async (req, res) => {

    const userId = req.user?.id

    if(!userId) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let linkSettings = await LinkSetting.findAll({ 
        where: {
            userId: userId
        },
        order: [
            ['id', 'ASC'],
        ],
    })

    res.send(linkSettings)
})

// @desc POST store
// @route POST /api/v2/linkSetting/store
// @access Private
const store = asyncHnadler( async (req, res) => {

    const data = req.body
    const userId = req.user?.id

    if(!userId && !data.hashtag) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    let tag = '#'+data.hashtag.replace('#', '')
    const tVideo = await TVideo.findOne({
        where: {
            desc: {
                [Op.regexp]: tag
            }
        },
        include: [ 
            {
                model: THashtag,
                include: [
                    {
                        model: Campaign,
                    }
                ]
            }, 
            {
                model: TUser,
                include: [
                    {
                        model: Campaign,
                    }
                ]
            }, 
        ],
    })

    if(tVideo) {
        const tvideo = tVideo.get({ plain: true })
        let row = {}
        if(tvideo.tHashtag) {
            row.campaignId = tvideo.tHashtag.campaign.id
        } else if(tvideo.tUser) {
            row.campaignId = tvideo.tUser.campaign.id
        }

        row.uuid = uuid.v4()
        row.hashtag = tag
        row.imageURL = data?.imgURL ? data.imgURL:''
        row.title = data?.title ? data.title:''
        row.pageURL = data?.pageURL ? data.pageURL:''
        row.campaignId = tvideo.tHashtag.campaign.id
        row.tVideoId = tvideo.id,
        row.userId = userId
        
        const ls = await LinkSetting.create(row)
        if(ls) {
            res.json(true)
        } else {
            res.json(false)
        }
    }

})

module.exports = {
    index,
    store
}