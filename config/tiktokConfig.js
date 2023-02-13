
const tConfig = {
    "secretKey": "webapp1.0+202106",
    "algorithm": "aes-128-cbc",
    "videoListCount": 30,
    "cursor": 0,
    "offset": 0,
    "key": {
        "create": "CREATE",
        "scheduleUpdate": "SCHEDULE_UPDATE",
    }
}

const tAppURLs = {
    "user": {
        "getProfileURL": (uniqueId) => {
            uniqueId = uniqueId.replace('@', '')
            return `https://www.tiktok.com/@${uniqueId}`
        }
    },
    "hashtag": {
        "getSearchURL": (hashtag) => {
            hashtag = hashtag.replace('#', '')
            return `https://www.tiktok.com/search/video?q=${hashtag}`
        }
    },
    "video": {
        "getSingleURL": (uniqueId, videoId) => {
            uniqueId = uniqueId.replace('@', '')
            return `https://www.tiktok.com/@${uniqueId}/video/${videoId}`
        }
    }
}

const tApiURLs = {
    "user": {
        "profileURL": "https://www.tiktok.com/api/user/detail/",
        "tiktokListURL": "https://www.tiktok.com/api/post/item_list/"
    },
    "hashtag": {
        "searchURL": "https://www.tiktok.com/api/search/general/full/", // keyword: #{hashtag}, offset: 0
    },
    "video": {
        "singleURL": "https://www.tiktok.com/node/share/video/", // https://www.tiktok.com/node/share/video/{videoUsername}/{videoId}
    }
}

module.exports = {
    tAppURLs,
    tApiURLs,
    tConfig
}