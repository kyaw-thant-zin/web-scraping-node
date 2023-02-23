const fs = require('fs-extra')
const CryptoJS = require("crypto-js")
const db = require('../models/index')
const Scraper = require('../scraper/index')
const { appConfig } = require('../config/appConfig')
const { tConfig } = require('../config/tiktokConfig')
const asyncHnadler = require('express-async-handler')

// Create main Model
const Campaign = db.campaigns
const LinkType = db.linkTypes
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
            model: TUser,
            include: [{
                model: TVideo
            }]
        }, {
            model: THAshtag,
            include: [{
                model: TVideo
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

// @desc POST update-visibility
// @route POST /api/v2/campaignOutput/visibility/update
// @access Private
const updateVisibility = asyncHnadler( async (req, res) => {

    const { tVideoId, visibility } = req.body
    const userId = 12

    if(tVideoId === undefined || visibility === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    
    try {
        const tVideo = await TVideo.update({ visibility: visibility }, {
            where: {
                id: tVideoId,
            }
        })

        if(tVideo) {
            res.json(true)
        } else {
            res.json(false)
        }

    } catch (error) {
        console.log(error)
    }

    

})

// @desc POST update-priority
// @route POST /api/v2/campaignOutput/priority/update
// @access Private
const updatePriority = asyncHnadler( async (req, res) => {

    const { tVideoId, priority } = req.body
    const userId = 12

    if(tVideoId === undefined || priority === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    const tVideo = await TVideo.update({ priority: priority }, {
        where: {
            id: tVideoId,
        }
    })

    if(tVideo) {
        res.json(true)
    } else {
        res.json(false)
    }
})


const getNewVideoAndUpdate = async (tVideoId, link) => {

    return new Promise(async (resovle, reject) => {
        console.log(link)
        const urlObj = new URL(link)
            if(urlObj.host == 'www.tiktok.com' || urlObj.host == 'tiktok.com') {
                const pathArray = urlObj.pathname.split('/')
                if(pathArray[2] == 'video') {
                    const response = await Scraper.tiktok.getVideoByURL(urlObj)
                    if(response?.data) {
                        const tVideoRow = response.data
                        try {
                            const tVideo =  await TVideo.update( tVideoRow, {
                                where: {
                                    id: tVideoId,
                                }
                            })
                            if(tVideo) {
                                resovle(tVideoRow)
                            } else {
                                resovle(false)
                            }
                        } catch (error) {
                            console.log(error)
                            resovle(false)   
                        }
                    } else {
                        resovle(false)
                    }
                }
            }
    })
}


// @desc POST update-link
// @route POST /api/v2/campaignOutput/link/update
// @access Private
const updateLink = asyncHnadler( async (req, res) => {

    const { tVideoId, link } = req.body
    const userId = 12

    if(tVideoId === undefined || link === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    const tV  = await TVideo.findOne({
        where: {
            id: tVideoId
        }
    })
    const tvideo = tV.get({ plain: true })

    if(tvideo && tvideo.webVideoURL != link) {
        const response = await getNewVideoAndUpdate(tVideoId, link)
        if(response) {
            res.json(response)
        } else {
            res.json(false)
        }
    } else {
        res.json(true)
    }
    
    
})


module.exports = {
    index,
    updateLink,
    updateVisibility,
    updatePriority,
    getNewVideoAndUpdate
}