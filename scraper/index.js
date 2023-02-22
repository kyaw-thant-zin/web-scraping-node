const TikTok = require('./TikTok')

const Scraper = {
    'tiktok': {
        'getVideosByHashtag': async (hashtag) => {
            console.log('hashtag scraper......')
            const response = await TikTok.getVideosByHashtag(hashtag)
            if(response) {
                return response
            } else {
                return false
            }
        },
        'getVideosByAccount': async (account) => {
            console.log('account scraping......')
            const response = await TikTok.getVideosByAccount(account)
            if(response) {
                return response
            } else {
                return false
            }
        },
        'getVideoByURL': async (urlObj) => {
            console.log('url scraping......')
            const response = await TikTok.getVideoByURL(urlObj)
            if(response) {
                return response
            } else {
                return false
            }
        }
    }

}

module.exports = Scraper