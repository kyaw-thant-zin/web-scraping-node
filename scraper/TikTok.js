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

// ACCOUNT
let accountInfo = ''
let accountVideos = ''
let accountReqListHeader = ''
let accountReqListURL = ''

// HASHTAG
let accountURL = ''
let hashtagList = ''

/**
 *  Scraper Configuration
 */

// decrpyt header and set cursor
const setCursor = (xttparams) => {
    const decipher = crypto.createDecipheriv(tConfig.algorithm, tConfig.secretKey, tConfig.secretKey)
    const decrpyted = Buffer.concat([decipher.update(xttparams, 'base64'), decipher.final()])
    const decrpytedVideoListParams = decrpyted.toString("utf-8")
    const decrpytedVideoListQuery = new URLSearchParams(decrpytedVideoListParams)
    decrpytedVideoListQuery.set('cursor', 0)
    return decrpytedVideoListQuery
}

// crypt back and set the x-tt-params
const getXTTPARAMS = (decrpytedVideoListQuery) => {
    const str = new URLSearchParams(decrpytedVideoListQuery).toString()
    const cipher = crypto.createCipheriv(tConfig.algorithm, tConfig.secretKey, tConfig.secretKey)
    const crpyted = Buffer.concat([cipher.update(str), cipher.final()])
    const xttParams = crpyted.toString("base64")
    return xttParams
}

const browserLaunch = async () => {

    return new Promise(async (resovle, reject) => {
        
        global.browser.chromium = await chromium.launch({ 
            headless: true,
        })
        console.log('Browser is running......')
        console.log('-------------Browser ready----------')
        
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
                const context = await global.browser.chromium.newContext({
                    ...global.browser.devices.DesktopChrome,
                    storageState: global.browser.authFile,
                })
                page = await context.newPage()
            } else {
                console.log('---------- else -----------')
                await browserLaunch()
                const context = await global.browser.chromium.newContext({
                    ...global.browser.devices.DesktopChrome,
                    storageState: global.browser.authFile,
                })
                page = await context.newPage()
            }
        } catch (error) {
            console.log(error)            
        }

        if(page) {

            // prevent timeout error
            await page.setDefaultNavigationTimeout(chromiumPage.setDefaultNavigationTimeout)

            // skip unnecessary network requests
            const newPage = await skipUnnecessaryRequests(page)
            resovle(newPage)
        } else {
            resovle(false)
        }
    })

}

// skip unnecessary network requests
const skipUnnecessaryRequests = async (page) => {

    return new Promise(async (resovle, reject) => {
        try {

            page.on('request', async (request) => {
                // user info request
                if(request.url().includes('api/user/detail')) {
                    console.log('<<', request.url())
                    accountURL = request.url()
                }

                // user video list request
                if(request.url().includes('api/post/item_list')) {
                    console.log('<<', request.url())
                    accountReqListURL = request.url()
                    accountReqListHeader = request.headers()
                }
            })
        
            page.on('response', async (response) => {

                // user info response
                if(response.url().includes('api/user/detail')) {
                    console.log('>>', response.url())
                    try {
                        console.log('----------------take user------------')
                        const responseBodyBufferUser = await response.body();
                        const userInfo = JSON.parse(responseBodyBufferUser.toString())
                        console.log('----------------got user------------')
                        accountInfo = userInfo.userInfo
        
                    } catch (error) {
                        console.log(error)
                    }
                }

                // user videos response
                if(response.url().includes('api/post/item_list')) {
                    console.log('>>', response.url())
                    try {
                        console.log('----------------take video list------------')
                        const responseBodyBufferUserVideos = await response.body();
                        const videos = JSON.parse(responseBodyBufferUserVideos.toString())
                        console.log('----------------got video list------------')
                        if(videos?.itemList) {
                            accountVideos = videos.itemList
                        }
        
                    } catch (error) {
                        console.log(error)
                    }
                }

                // hashtag response
                if(response.url().includes('api/search/item/full')) {
                    console.log('------------API fetch------------')
                    console.log('>>', response.url())
                    try {
                        console.log('----------------take hashtag list------------')
                        const responseBodyBufferUser = await response.body();
                        const tags = JSON.parse(responseBodyBufferUser.toString())
                        console.log('----------------got hashtag list------------')
                        if(tags?.item_list) {
                            hashtagList = tags.item_list
                        }
        
                    } catch (error) {
                        console.log(error)
                    }
                }

            })

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
                    console.log('------page created------')
                    const acc = account.replace('@', '')
                    const appURL = tAppURLs.user.getProfileURL(acc)
                    console.log(appURL)
                    await page.goto(appURL, {
                        waitUntil: chromiumPage.waitUntil.networkidle0,
                    })
                    await page.screenshot({
                        path: './scraper/err_img/'+account+'.jpg'
                    })
                    console.log('-----account page ready-----')
                    console.log('-----Page scroll-----')
                    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
                    await page.waitForTimeout(2000)
                    console.log('-----Page scroll done-----')

                    if(accountReqListURL && accountReqListHeader) {

                        console.log('------------API URL found------------')
                        const xttparams = accountReqListHeader['x-tt-params']
                        const decrpytedXttParams = setCursor(xttparams)
                        const newXttParams = getXTTPARAMS(decrpytedXttParams)
                        accountReqListHeader['x-tt-params'] = newXttParams
                        console.log('------------Decrypt Header & Encrypt Header------------')
                        await page.setExtraHTTPHeaders(accountReqListHeader)
                        console.log('------------Fetch Video List------------')
                        await page.goto( accountReqListURL, {
                            waitUntil: 'networkidle0'
                        })
                        console.log('------------Video list page ready------------')
                        await page.waitForTimeout(2000)

                        if(accountVideos && accountInfo) {
                            user.userInfo = accountInfo
                            const newList = accountVideos.slice(0, 11)
                            const videoLists = await beautify(newList, 'account')
                            if(videoLists) {
                                user.items = videoLists
                                await page.close()
                                console.log('---------Page closed--------')
                                resovle(user)
                            } else {
                                console.log('---------No video found--------')
                                await page.close()
                                console.log('---------Page closed--------')
                                resovle(false)
                            }
                        } else {
                            console.log('---------No video found--------')
                            await page.close()
                            console.log('---------Page closed--------')
                            resovle(false)
                        }

                    } else {
                        console.log('---------No API found--------')
                        await page.close()
                        console.log('---------Page closed--------')
                        resovle(false)
                    }
                    
                } else {
                    resovle(false)
                    await page.close()
                    console.log('---------Page closed--------')
                }
                
            }
        } catch (error) {
            console.log(error)
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
                const userArray = [
                    'charlidamelio',
                    'khaby.lame',
                    'bellapoarch',
                    'addisonre',
                    'willsmith',
                    'dixiedamelio',
                    'therock',
                    'youneszarou',
                ]
                const randomIndex = Math.floor(Math.random() * 8)
                const profileURL = 'https://www.tiktok.com/@'+userArray[randomIndex]

                const page = await openNewPage('hashtag')
                if(page) {
                    await page.goto(profileURL, {
                        waitUntil: chromiumPage.waitUntil.networkidle0,
                    })
                    await page.screenshot({
                        path: './scraper/err_img/'+tag+'.jpg'
                    })
                    console.log('----------go to profile first-----------')
                    if(accountURL != '') {
                        console.log('------------API URL found------------')
                        const newURL = new URL(accountURL)
                        const searchParams = newURL.searchParams
                        newURL.pathname = '/api/search/item/full/'
                        newURL.origin = 'https://www.tiktok.com'
                        newURL.host = 'www.tiktok.com'
                        newURL.hostname = 'www.tiktok.com'
                        searchParams.set('from_page', 'search')
                        searchParams.set('offset', '0')
                        searchParams.set('region', 'JP')
                        searchParams.set('priority_region', 'JP')
                        searchParams.set('from_page', 'search')
                        searchParams.set('tz_name', 'Asia/Tokyo')
                        searchParams.set('keyword', tag)
                        searchParams.delete('verifyFp')
                        searchParams.delete('uniqueId')
                        const finalURL = newURL.toString()
                        await page.goto( finalURL, {
                            waitUntil: chromiumPage.waitUntil.networkidle0
                        })
                        await page.waitForTimeout(2000)
                        console.log('------------API Page Ready------------')
                        if(hashtagList) {
                            const videos = await beautify(hashtagList, 'hashtag')
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
                        } else {
                            console.log('------------Cannot find Hashtag------------')
                            await page.close()
                            resovle(false)
                        }

                    } else {
                        console.log('------------Cannot find API URL------------')
                        await page.close()
                        resovle(false)
                    }
                    
                } else {
                    await page.close()
                    resovle(false)
                }
            }

        } catch (error) {
            console.log(error)
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