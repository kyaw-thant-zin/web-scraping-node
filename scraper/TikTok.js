const url = require("url")
const path = require("path")
const util = require('util')
const fs = require('fs-extra')
const moment = require('moment-timezone')

const needle = require('needle')
const { load } = require('cheerio')

const crypto = require('crypto')
const express = require("express")
const { chromiumPage } = require('../config/puppeteerConfig')
const { tAppURLs, tApiURLs, tConfig } = require('../config/tiktokConfig')

/**
 * Scraper Variables
 */
const removeResourceTypes = ['image', 'font', 'other', 'media']
let accountInfo = ''
let accountList = ''
let hashtagList = ''

/**
 *  Scraper Configuration
 */

// decrpyt header and set cursor
const setCursor = () => {
    const decipher = crypto.createDecipheriv(tConfig.algorithm, tConfig.secretKey, tConfig.secretKey)
    const decrpyted = Buffer.concat([decipher.update(apiListHeaders['x-tt-params'], 'base64'), decipher.final()])
    const decrpytedVideoListParams = decrpyted.toString("utf-8")
    const decrpytedVideoListQuery = new URLSearchParams(decrpytedVideoListParams)
    decrpytedVideoListQuery.set('cursor', 0)
    return decrpytedVideoListQuery
}

// crypt back and set the x-tt-params
const setXTTPARAMS = (decrpytedVideoListQuery) => {
    const str = new URLSearchParams(decrpytedVideoListQuery).toString()
    const cipher = crypto.createCipheriv(tConfig.algorithm, tConfig.secretKey, tConfig.secretKey)
    const crpyted = Buffer.concat([cipher.update(str), cipher.final()])
    const xttParams = crpyted.toString("base64")
    apiListHeaders['x-tt-params'] = xttParams
}

const browserLaunch = async () => {

    return new Promise(async (resovle, reject) => {

        const browser = {
            userDir: './profiles',
            authFile: './.auth/auth.json',
            devices: {
                'DesktopChrome': devices['Desktop Chrome']
            },
            loginURL: 'https://www.tiktok.com/login/phone-or-email/email'
        }

        browser.chromium = await chromium.launchPersistentContext('./profiles', { 
            headless: true,
        })
        console.log('Browser is running......')
    
        page = await browser.chromium.newPage({
            storageState: browser.authFile,
        })
    
        const loginURL = 'https://www.tiktok.com/login/phone-or-email/email'
        await page.goto( loginURL, {
            waitUntil: 'networkidle0'
        })
    
        await page.waitForTimeout(5000)
    
        console.log('------------Get current URL------------')
        const currentUrl = await page.url();
        console.log(`Current URL: ${currentUrl}`);
    
        console.log('------------Check login page or not------------')
        if(currentUrl == loginURL) {
            await page.fill('input[name="username"]', 'icdl.webmaster.0001@gmail.com')
            await page.fill('input[type="password"]', 'bf_mMWPh66')
            await page.getByRole('button', { name: 'Log in' }).click()
            await page.waitForTimeout(3000)
            await page.context().storageState({ path: browser.authFile })
            console.log('------------login successful-------------')
        } else {
            console.log('------------Already logged in------------')
        }
    
        console.log('-------------Browser ready----------')
        global.browser = browser
        
        resovle(true)

    })
}

// create a new tab 
const openNewPage = async (scrapingMethod) => {

    return new Promise(async (resovle, reject) => {
        console.log('create a new page.....')
        let page
        // Create a new page
        try {
            if(global.browser.chromium != null) {
                page = await global.browser.chromium.newPage({
                    // ...global.browser.devices.DesktopChrome,
                    // geolocation: { longitude: 48.858455, latitude: 2.294474 },
                    // permissions: ['geolocation'],
                    // storageState: global.browser.authFile,
                })
            } else {
                console.log('---------- else -----------')
                await browserLaunch()
                page = await global.browser.chromium.newPage({
                    storageState: global.browser.authFile,
                })
            }
        } catch (error) {
            console.log(error)            
        }

        if(page) {

            // prevent timeout error
            await page.setDefaultNavigationTimeout(chromiumPage.setDefaultNavigationTimeout)

            // skip unnecessary network requests
            const newPage = await skipUnnecessaryRequests( scrapingMethod, page)
            resovle(newPage)
        } else {
            resovle(false)
        }
    })

}

// skip unnecessary network requests
const skipUnnecessaryRequests = async (scrapingMethod, page) => {

    return new Promise(async (resovle, reject) => {
        try {
            if(scrapingMethod === 'account') {
                console.log('skip requests by account')
                
            } else if(scrapingMethod === 'hashtag') {
                page.on('response', async (response) => {
                    if(response.url().includes("api/search/general/full")) {
                        // console.log('<<', response.status(), response.url())
                        try {
                            const responseBodyBuffer = await response.body();
                            hashtagList = JSON.parse(responseBodyBuffer.toString())
                        } catch (error) {
                            hashtagList = null
                        }
                    }
                })
            }

            console.log('---------return new page-----')
            resovle(page)
        } catch (error) {
            resovle(false)
        }
    })

}

// get playable tiktok video url
const getVideoPlayAbleURL = async (id, userId) => {

    return new Promise(async (resovle, reject) => {
        const host = 'https://ttsave.app/download'
        const body = { id: `https://www.tiktok.com/${userId}/video/${id}` }

        const res  = await needle("post", host, body, {json: true})
        try {

            const $ = load(res.body)
            const video = {
                url: {
                  no_wm: $("a:contains('DOWNLOAD (WITHOUT WATERMARK)')").attr("href"),
                  wm: $("a:contains('DOWNLOAD (WITH WATERMARK)')").attr("href"),
                }
            }

            resovle(video)

        } catch (error) {
            resovle(false)
        }
    })
}


// ------------------------- ***** URL ***** ----------------------------//
const getVideoByURL = async (urlObj) => {
    return new Promise(async (resovle, reject) => {

        // const api = 'https://api.ssstiktok.ws/api?url='+url
        const webVideoURL = urlObj.href
        const pathArray = urlObj.pathname.split('/')
        const uniqueId = pathArray[1]
        const videoId = pathArray[3]
        const api = 'https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id='+videoId

        try {
            console.log('----------fetch video URL----------')
            const res  = await needle("get", api, {json: true})
            if(res.body?.aweme_list) {
                console.log('----------got aweme list----------')
                const aweme = res.body.aweme_list[0]
                if(aweme) {
                    console.log('----------got aweme----------')
                    const desc = aweme.desc
                    const videoObj = aweme.video

                    const next4Hours = moment().add(4, 'hours').add(50, 'minutes')
                    const expiresIn  = next4Hours.format('YYYY/MM/DD HH:mm:ss')
                    const createTime = moment.unix(aweme.create_time).format("YYYY/MM/DD")
                    const tVideoRow = {
                        secVideoId: videoId,
                        desc: desc,
                        playCount: aweme.statistics.play_count,
                        diggCount: aweme.statistics.digg_count,
                        commentCount: aweme.statistics.comment_count,
                        shareCount: aweme.statistics.share_count,
                        originCoverURL: videoObj.origin_cover.url_list[0],
                        secVideoURL: videoObj.download_addr.url_list[1],
                        webVideoURL: webVideoURL,
                        expiresIn: expiresIn,
                        createTime: createTime,
                        authorUniqueId: uniqueId.replace('@', ''),
                        authorNickName: aweme.author.nickname,
                        authorSignature: aweme.author.signature,
                        authorAvatarLarger: aweme.author.avatar_larger.url_list[1]
                    }

                    resovle({
                        data: tVideoRow
                    })

                } else {
                    resovle(false)
                }
            } else {
                resovle(false)
            }

        } catch (error) {
            resovle(false)
        }

    })
}
// ------------------------- ***** URL ***** ----------------------------//

// beautify data
const beautify = async (videoList, scrapingMethod) => {
    return new Promise(async (resovle, reject) => {
        try {
            console.log('----- beautify ------')

            if(videoList && videoList.length > 0) {
                const videoListKey = [ 'author', 'id', 'stats', 'createTime', 'desc', 'video']
                const videoKey = ['id', 'format', 'duration', 'originCover', 'playAddr', 'videoQuality']
                let bVideoList = []
                if(scrapingMethod === 'hashtag') {
                    for(const vd of videoList) {
                        const video = vd.item
                        const dumpVideo = {}
                        for(const key in video) {
                            if(videoListKey.includes(key)) {
                                if(key == 'video') {
                                    const videoObj = video[key]
                                    const dumpVideoChild = {}
                                    for(const childKey in videoObj) {
                                        if(videoKey.includes(childKey)) {
                                            if(childKey == 'playAddr') {
                                                const webVideoURL = `https://www.tiktok.com/${video.author.uniqueId}/video/${video.id}`
                                                console.log(webVideoURL)
                                                const webUrl = new URL(webVideoURL)
                                                // const playAddr = await getVideoPlayAbleURL(video.id, video.author.uniqueId)
                                                const playAddr = await getVideoByURL(webUrl)
                                                dumpVideoChild['originalPlayAddr'] = videoObj[childKey]
                                                if(playAddr) {
                                                    dumpVideoChild[childKey] = playAddr.data.secVideoURL
                                                } else {
                                                    dumpVideoChild[childKey] = videoObj[childKey]
                                                }
                                            } else {
                                                dumpVideoChild[childKey] = videoObj[childKey]
                                            }
                                        }
                                    }
                                    dumpVideo[key] = dumpVideoChild
                                } else {
                                    dumpVideo[key] = video[key]
                                }
                            }
                        }
                        bVideoList.push(dumpVideo)
                    }
                } else if(scrapingMethod === 'account') {
                    for(const video of videoList) {
                        const dumpVideo = {}
                        for(const key in video) {
                            if(videoListKey.includes(key)) {
                                if(key == 'video') {
                                    const videoObj = video[key]
                                    const dumpVideoChild = {}
                                    for(const childKey in videoObj) {
                                        if(videoKey.includes(childKey)) {
                                            if(childKey == 'playAddr') {
                                                const webVideoURL = `https://www.tiktok.com/${video.author.uniqueId}/video/${video.id}`
                                                console.log(webVideoURL)
                                                const webUrl = new URL(webVideoURL)
                                                // const playAddr = await getVideoPlayAbleURL(video.id, video.author.uniqueId)
                                                const playAddr = await getVideoByURL(webUrl)
                                                dumpVideoChild['originalPlayAddr'] = videoObj[childKey]
                                                if(playAddr) {
                                                    dumpVideoChild[childKey] = playAddr.data.secVideoURL
                                                } else {
                                                    dumpVideoChild[childKey] = videoObj[childKey]
                                                }
                                            } else {
                                                dumpVideoChild[childKey] = videoObj[childKey]
                                            }
                                        }
                                    }
                                    dumpVideo[key] = dumpVideoChild
                                } else {
                                    dumpVideo[key] = video[key]
                                }
                            }
                        }
                        bVideoList.push(dumpVideo)
                    }
                }
                console.log('beautify done....')
                resovle(bVideoList)
            } else {
                resovle(false)
            }
        } catch (error) {
            resovle(error)
        }
    })
}

const allDone = async (page) => {
    return new Promise(async (resovle, reject) => {
        await page.close()
        console.log("Page closed!")
        await mainBrowser.close()
        console.log("Browser closed!")

        if (chromeTmpDataDir !== null) {
            fs.removeSync(chromeTmpDataDir);
        }

        resovle(true)
    })
}

// ------------------------- ***** account ***** ----------------------------//
const getVideosByAccount = async (account) => {

    return new Promise(async (resovle, reject) => {
        try {
            console.log('tiktok scraping by account....')
            const user = {}

            if(account != '') {
                const page = await openNewPage('account')
                if(page) {
                    const acc = account.replace('@', '')
                    const appURL = tAppURLs.user.getSearchURL(acc)
                    console.log(appURL)
                    await page.goto(appURL, {
                        waitUntil: 'networkidle0'
                    })
                    console.log('-----account search page ready-----')
                    console.log('-----find link-----')
                    const link = await page.$('a[href="/@'+acc+'"]');

                    // If the link exists, click it
                    if (link) {
                        console.log('------account link found----')
                        const responseUserPromise = page.waitForResponse(response => response.url().includes("api/user/detail"))
                        const responseListPromise = page.waitForResponse(response => response.url().includes("api/post/item_list"))
                        await link.click()
                        console.log('----------wait for profile page ready---------')
                        const responseUser = await responseUserPromise
                        const responseList = await responseListPromise
                        console.log('----------profile page ready---------')
                        console.log('------------got response----------')
                        try {
                            console.log('----------------take user info------------')
                            const responseBodyBufferUser = await responseUser.body();
                            const userInfo = JSON.parse(responseBodyBufferUser.toString())
                            console.log('----------------got user info------------')
                           if(userInfo?.userInfo) {
                                user.userInfo = userInfo.userInfo
                           }

                        } catch (error) {
                            console.log(error)
                            accountInfo = null
                            accountList = null
                            await page.close()
                            console.log('---------Page closed--------')
                            resovle(false)
                        }

                        if(user?.userInfo) {
                            try {
                                console.log('----------------take videos------------')
                                const responseBodyBufferList = await responseList.body();
                                const videos = JSON.parse(responseBodyBufferList.toString())
                                console.log('----------------got videos------------')
                                if(videos?.itemList) {
                                    const newList = videos.itemList.slice(0, 11)
                                    const videoLists = await beautify(newList, 'account')
                                    if(videoLists) {
                                        user.items = videoLists
                                        await page.close()
                                        console.log('---------Page closed--------')
                                        resovle(user)
                                    }
                                } else {
                                    accountList = null
                                }
                            } catch (error) {
                                console.log(error)
                                accountInfo = null
                                accountList = null
                                await page.close()
                                console.log('---------Page closed--------')
                                resovle(false)
                            }
                        }
                    } else {
                        resovle(false)
                        await page.close()
                        console.log('---------Page closed--------')
                    }
                    
                } else {
                    resovle(false)
                    await page.close()
                    console.log('---------Page closed--------')
                }
                
            }
        } catch (error) {
            resovle(error)
        }

        resovle(false)
    })
}
// ------------------------- ***** account ***** ----------------------------//

// ------------------------- ***** hashtag ***** ----------------------------//
const getVideosByHashtag = async (hashtag) => {

    return new Promise(async (resovle, reject) => {
        try {

            const hashtagResults = {}
            
            if(hashtag != '') {
                console.log('tiktok scraping by hashtag....')
                const tag = hashtag.replace('#', '')
                const page = await openNewPage('hashtag')
                if(page) {
                    const appURL = tAppURLs.hashtag.getSearchURL(tag)
                    console.log(appURL)
                    await page.goto(appURL, {
                        waitUntil: chromiumPage.waitUntil.networkidle0,
                    })
                    console.log('----------page ready-----------')
                    
                    if(hashtagList && hashtagList?.data) {
                        const videos = await beautify(hashtagList.data, 'hashtag')
                        if(videos) {
                            console.log('-----------Got Video----------')
                            hashtagResults.items = videos
                            await page.close()
                            console.log('---------Page closed--------')
                            resovle(hashtagResults)
                        } else {
                            console.log("not getting video list")
                            resovle(false)
                            await page.close()
                            console.log('---------Page closed--------')
                        }
                    }
                    
                    
                } else {
                    resovle(false)
                }
            }

        } catch (error) {
            resovle(false)
        }
    })
}
// ------------------------- ***** hashtag ***** ----------------------------//


module.exports = {
    getVideosByHashtag,
    getVideosByAccount,
    getVideoByURL
}