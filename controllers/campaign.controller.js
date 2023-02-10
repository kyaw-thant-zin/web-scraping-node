const CryptoJS = require("crypto-js")
const moment = require('moment')
const asyncHnadler = require('express-async-handler')
const db = require('../models/index')
const Scraper = require('../scraper/index')
const { tConfig } = require('../config/tiktokConfig')
const { appConfig } = require('../config/appConfig')

// Create main Model
const Campaign = db.campaigns
const CollectionType = db.collectionTypes
const LinkType = db.linkTypes
const CampaignOutput = db.campaignOutputs
const TUser = db.tUsers
const TVideo = db.tVideos
const ApiLayout = db.apiLayouts

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

// get create time
const getCreateDate = (createTime) => {
    return moment.unix(createTime).format("YYYY/MM/DD")
}

// get expires date
const getExpiresDate = (videoURL) => {
    const videoUrl = new URL( videoURL )
    const searchParams = videoUrl.searchParams
    const expire = searchParams.get('expire')
    const actualExpiresIn = moment.unix(expire)
    const expiresIn = moment(actualExpiresIn).subtract(5, 'minutes').format("YYYY/MM/DD HH:mm:ss")
    return expiresIn
}

// create an array for create or update tUser
const bulkCreateTUser = (userInfo, campaignOutputId, state) => {

    let row = {}

    if(state === tConfig.key.create) {

        row.accountId = userInfo.user.id
        row.uniqueId = userInfo.user.uniqueId
        row.nickname = userInfo.user.nickname
        row.followerCount = userInfo.stats.followerCount
        row.followingCount = userInfo.stats.followingCount
        row.videoCount = userInfo.stats.videoCount
        row.heartCount = userInfo.stats.heartCount
        row.avatarLarger = userInfo.user.avatarLarger
        row.campaignOutputId = campaignOutputId

    } else if(state === tConfig.key.scheduleUpdate) {



    }

    return row

}

// create an array for create or update tVideo
const bulkCreateTVideos = (userItems, tUser, state) => {

    return new Promise(async (resovle, reject) => {

        const rows = userItems.map((item, index) => {

            if(state === tConfig.key.create) {
    
                const row = {
                    videoId: item.video.id,
                    desc: item.desc,
                    playCount: item.stats.playCount,
                    diggCount: item.stats.diggCount,
                    commentCount: item.stats.commentCount,
                    shareCount: item.stats.shareCount,
                    originCoverURL: item.video.originCover,
                    videoURL: item.video.playAddr,
                    webVideoURL: `https:www.tiktok.com/@${tUser.uniqueId}/video/${item.video.id}`,
                    expiresIn: getExpiresDate(item.video.playAddr),
                    createTime: getCreateDate(item.createTime),
                    tUserId: tUser.id
                }     
                
                return row
    
            }   
    
        })
    
        resovle(rows)
    
    })
    

}

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
        visibility: appConfig.key.visibility,
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
            console.log('---------------- Account ------------------')
            const response = await Scraper.tiktok.getVideosByAccount(campaign.account)
            // got the resposne and user info
            if(response && response?.userInfo) {
                console.log('----- got user info ------')
                // got the video list
                if(response?.items) {
                    console.log('----- got user items ------')
                    console.log('Camapign Output Creating.....')
                    // store in the campaing output table
                    const campaignOutput = await CampaignOutput.create({
                        visibility: appConfig.key.visibility,
                        linkURL: '',
                        priority: appConfig.key.priority,
                        campaignId: campaign.id
                    }).then(campaignOutput => {
                        return campaignOutput.get({ plain: true })
                    })
                    if(campaignOutput) {
                        console.log('Camapign Output Created.....')
                        console.log('tUser Creating.....')
                        // store in the tUser table
                        const tUserRow = bulkCreateTUser(response.userInfo, campaignOutput.id, tConfig.key.create)
                        let tUser = null

                        try {
                            tUser = await TUser.create(tUserRow).then(tUser => {
                                return tUser.get({ plain: true })
                            })

                            if(tUser) {
                                console.log('tUser Created.....')
                                console.log('tVideos Creating.....')
    
                                // store in the iVideo table
                                const tVideoRows = await bulkCreateTVideos(response.items, tUser, tConfig.key.create)
                                let tVideos = null
                                try {
                                    tVideos = await TVideo.bulkCreate(tVideoRows)
                                    if(tVideos) {
                                        console.log('tVideos Created.....')
                                        console.log('apiLayout Creating.....')

                                        // store in the apiLayout table
                                        const apiLayout = await ApiLayout.create({
                                            layoutType: appConfig.key.layoutType,
                                            showAccount: appConfig.key.showAccount,
                                            showTitle: appConfig.key.showTitle,
                                            showHashtag: appConfig.key.showHashtag,
                                            apiToken: CryptoJS.AES.decrypt(campaign.uuid, appConfig.screctKey).toString(CryptoJS.enc.Utf8),
                                        })
        
                                        if(apiLayout) {
                                            console.log('apiLayout Created.....')
                                            res.json(true)
                                        } else {
                                            res.json(false)
                                        }
                                    }
                                } catch (error) {
                                    console.log(error)
                                    res.json(false)
                                }

                            }

                        } catch (error) {
                            console.log(error)
                            res.json(false)
                        }
                    }
                    
                }
            }
            console.log('---------------- Account ------------------')
        }
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

    let campaign = null
    try {
        campaign = await Campaign.destroy({
            where: {
                id: id,
                userId: userId
            }
        })
    } catch (error) {
        console.log(error)
    }

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