const TikTok = require('./TikTok')

const Scraper = {
    'tiktok': {
        'getVideosByHashtag': async (hashtag) => {
            console.log('hashtag scraper......')
            await TikTok.getVideosByHashtag(hashtag)
        },
        'getVideosByAccount': async (account) => {
            console.log('account scraping......')
            const response = await TikTok.getVideosByAccount(account)
            if(response) {
                return response
            } else {
                return false
            }
        }
    }

}

module.exports = Scraper