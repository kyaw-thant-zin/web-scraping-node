const moment = require('moment')
const db = require('../models/index')
const sequelize = require('sequelize')
const asyncHnadler = require('express-async-handler')
const { getNewVideoAndUpdate } = require('../controllers/campaignOutput.controller')

const TVideo = db.tVideos

const TikTokEvent = {
    'checkAndUpdateVideoURL': async () => {
        console.log('----------------CheckAndUpdateVideoURL----------------------')

        // current time + 5 minutes ahead
        const current = moment().add(5, 'minutes').format('YYYY/MM/DD HH:mm:ss')

        // get only near-expiration video URL
        const tVideos = await TVideo.findAll({
            where: sequelize.where(sequelize.fn('date', sequelize.col('expiresIn')), '<', current),
            raw: true,
        })

        if(tVideos) {
            console.log('---------------------LoopVideos-------------------')
            for(const tvideo of tVideos) {
                console.log(`---------------------GettingAndSaving - ${tvideo.id}-------------------`)
                const response = await getNewVideoAndUpdate(tvideo.id, tvideo.webVideoURL)
                console.log(`---------------------GettingAndSaving - ${tvideo.id} done!-------------------`)
                if(response) {
                    console.log(response)
                }
            }
        }
    }
}

module.exports = TikTokEvent