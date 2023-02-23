
const later = require('@breejs/later')
const TikTokEvent = require('./tiktok-event')

const Schedule = {
    'updateTVideoURL': () => {
        const textSched = later.parse.text(`${process.env.TIKTOK_VIDEO_URL_SCHEDULE_CRON}`)
        console.log('----Schedule----')
        const cron = later.setInterval(function () { 
            console.log('update......')
            // try {
            //     TikTokEvent.checkAndUpdateVideoURL()
            // } catch (error) {
            //     console.log(error)
            // }
         }, textSched)

        //  try {
        //         TikTokEvent.checkAndUpdateVideoURL()
        //     } catch (error) {
        //         console.log(error)
        //     }
    }
}

module.exports = Schedule