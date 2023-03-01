const fs = require('fs-extra')
const db = require('../models/index')
const { Sequelize, Op } = require('sequelize')
const { appConfig } = require('../config/appConfig')
const { tConfig } = require('../config/tiktokConfig')
const asyncHnadler = require('express-async-handler')

// CDN
const { getJSCode } = require('../cdn/hashvank')

// Create main Model
const TUser = db.tUsers
const TVideo = db.tVideos
const THashtag = db.tHashtags
const Campaign = db.campaigns
const InputCode = db.apiLayouts
const LinkSetting = db.linkSettings

// @desc GET campaignVideos
// @route GET /v1/api/:token/campaign/videos
// @access Public
const campaignVideos = async (req, res) => {

    const { token, callBack } = req.query
    if(!token) {
        res.setHeader('Content-Type', 'text/plain')
        res.status(400).end("{ error: missing fields..... }")
    } else {

        const inputCode = await InputCode.findOne({
            where: {
                apiToken: decodeURIComponent(token)
            },
        })

        if(inputCode) {
            const campaignId = inputCode.campaignId
            const campaign = await Campaign.findOne({
                include: [
                    {
                        model: InputCode
                    },
                    { 
                        model: THashtag,
                    },
                    { 
                        model: TUser,
                    }
                ],
                where: {
                    id: campaignId,
                    visibility: '1'
                },
            })

            if(campaign) {
                let videos
                const inputCode = campaign.apiLayout
                console.log(inputCode)
                if(campaign.tHashtag != null) {
                    videos = await TVideo.findAll({
                        where: {
                            tHashtagId: campaign.tHashtag.id
                        },
                        include: [
                            {
                                model: LinkSetting
                            }
                        ],
                        order: [
                            ['priority', 'DESC'], // Sort by priority value in descending order
                            ['id', 'ASC'] // Sort by id in ascending order
                        ]
                    })
                } else {
                    videos = await TVideo.findAll({
                        where: {
                            tUserId: campaign.tUser.id
                        },
                        include: [
                            {
                                model: LinkSetting
                            }
                        ],
                        order: [
                            ['priority', 'DESC'], // Sort by priority value in descending order
                            ['id', 'ASC'] // Sort by id in ascending order
                        ]
                    })
                }

                let jsCode
                if(videos) {
                    console.log('got videos')
                    if(callBack) {
                        jsCode = await getJSCode(videos, inputCode, callBack)
                    } else {
                        jsCode = await getJSCode(videos, inputCode, false)
                    }
                    res.send(jsCode)
                } else {
                    res.json({
                        message: "there's no available campaign......"
                    })
                }

            } else {
                res.json({
                    message: "there's no available campaign......"
                })
            }

        } else {
            res.json({
                error: 'Please check your token......'
            })
        }

    }
}


module.exports = {
    campaignVideos
}