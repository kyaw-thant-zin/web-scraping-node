const url = require("url")
const path = require("path")
const util = require('util')
const fs = require('fs-extra')
const moment = require('moment-timezone')

const needle = require('needle')
const { load } = require('cheerio')

const crypto = require('crypto')
const express = require("express")
const {executablePath} = require('puppeteer')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')
const { chromiumPage } = require('../config/puppeteerConfig')
const { tAppURLs, tApiURLs, tConfig } = require('../config/tiktokConfig')

/**
 * Scraper Variables
 */
const removeResourceTypes = ['image', 'font', 'other', 'media']
let apiUserURL = ''
let apiUserHeaders = {}
let apiListURL = ''
let apiListHeaders = {}
let apiHashtagURL = ''
let apiHashtagHeaders = {}

// Browser Setting
const browserSetting = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1000,1080', '--use-gl=egl', '--disable-dev-shm-usage', '--user-data-dir= profiles'],
    ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
    executablePath: executablePath(),
}

const browser = {
    'chromium': null
}
let mainBrowser = null
let chromeTmpDataDir = null

/**
 *  Scraper Configuration
 */
puppeteer.use(StealthPlugin())
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())

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

// launch the browser
const browserLaunch = async () => {
    return new Promise(async (resovle, reject) => {
        try {
            console.log('open browser.......')
            const browserNew = await puppeteer.launch( browserSetting )
            if(chromeTmpDataDir === null) {
                let chromeSpawnArgs = browserNew.process().spawnargs;
                for (let i = 0; i < chromeSpawnArgs.length; i++) {
                    if (chromeSpawnArgs[i].indexOf("--user-data-dir=") === 0) {
                        chromeTmpDataDir = chromeSpawnArgs[i].replace("--user-data-dir=", "");
                    }
                }
            }

            browser.chromium = browserNew
            resovle(browserNew)

        } catch (error) {
            resovle(error)
        }
    })
}

// create a new tab 
const openNewPage = async (localBrowser, scrapingMethod) => {

    return new Promise(async (resovle, reject) => {
        console.log('create a new page.....')
        let page
        // Create a new page
        if(localBrowser != null) {
            page = await localBrowser.newPage()
        } else {
            const browser = browserLaunch()
            page = await browser.newPage()
        }

        // Disable Cache
        await page.setCacheEnabled(chromiumPage.setCacheEnabled)

        // Set Browser Width and Height
        // await page.setViewport(chromiumPage.setViewport)

        // prevent timeout error
        await page.setDefaultNavigationTimeout(chromiumPage.setDefaultNavigationTimeout)

        await page.setRequestInterception(chromiumPage.setRequestInterception)

        // skip unnecessary network requests
        const newPage = await skipUnnecessaryRequests( scrapingMethod, page)
        resovle(newPage)
    })

}

// skip unnecessary network requests
const skipUnnecessaryRequests = async (scrapingMethod, page) => {

    return new Promise(async (resovle, reject) => {
        try {
            if(scrapingMethod === 'account') {
                console.log('skip requests by account')
                page.on('request', request => {
                    if (request.resourceType() === 'fetch') {
                        if(request.url().includes("api/post/item_list")) {
                            apiListURL = request.url()
                            apiListHeaders = request.headers()
                        }
                        if(request.url().includes("api/user/detail")) {
                            apiUserURL = request.url()
                            apiUserHeaders = request.headers()
                        }
                        request.continue()
                    } else if(removeResourceTypes.includes(request.resourceType())) {
                        request.abort()
                    } else if(request.resourceType() === 'script') {
                        request.continue()
                    } else {
                        request.continue()
                    }
                })
                resovle(page)
            } else if(scrapingMethod === 'hashtag') {
                page.on('request', request => {
                    if (request.resourceType() === 'fetch') {
                        if(request.url().includes("api/search/item/full")) {
                            apiHashtagURL = request.url()
                            apiHashtagHeaders = request.headers()
                        }
                        request.continue()
                    } else if(removeResourceTypes.includes(request.resourceType())) {
                        request.abort()
                    } else if(request.resourceType() === 'script') {
                        request.continue()
                    } else {
                        request.continue()
                    }
                })
                resovle(page)
            }
        } catch (error) {
            resovle(error)
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

// beautify data
const beautify = async (videoList) => {
    return new Promise(async (resovle, reject) => {
        try {
            console.log('----- beautify ------')
            if(videoList && videoList.length > 0) {
                const videoListKey = [ 'author', 'id', 'stats', 'createTime', 'desc', 'video']
                const videoKey = ['id', 'format', 'duration', 'originCover', 'playAddr', 'videoQuality']
                let bVideoList = []
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
                                            const playAddr = await getVideoPlayAbleURL(video.id, video.author.uniqueId)
                                            dumpVideoChild['originalPlayAddr'] = videoObj[childKey]
                                            if(playAddr) {
                                                dumpVideoChild[childKey] = playAddr.url.wm
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
const getAccountInfo = async (page, account) => {
    return new Promise(async (resovle, reject) => {
        try {
            console.log('----- getAccountInfo ------')
            const appURL = tAppURLs.user.getProfileURL(account)
            
            await page.goto(appURL, {
                waitUntil: chromiumPage.waitUntil.networkidle0,
            })

            const lastPosition = await scrollPageToBottom(page, chromiumPage.scrollSetting)

            if(apiUserURL != '') {
                console.log('----- request user info api -----')
                await page.setExtraHTTPHeaders(apiUserHeaders)
                await page.goto(apiUserURL, {
                    waitUntil: 'domcontentloaded',
                })
                await page.waitForSelector('pre')
                const element = await page.$('pre')
                const profileInfo = await page.evaluate(el => el.textContent, element)
                if(profileInfo) {
                    resovle(JSON.parse(profileInfo))
                } else {
                    resovle(false)
                }
            } else {
                resovle(false)
            }
        } catch (error) {
            resovle(error)
        }
    })
}

const getVideoList = async (page) => {
    return new Promise(async (resovle, reject) => {

        console.log('----- getVideoList ------')

        if(apiListURL !== '' && apiListHeaders !== '') {
            
            const decrpytedVideoListQuery = setCursor()
            setXTTPARAMS(decrpytedVideoListQuery)

            console.log('----- request video list api -----')
            await page.setExtraHTTPHeaders(apiListHeaders)
            await page.goto(apiListURL, {
                waitUntil: 'domcontentloaded',
            })

            await page.waitForSelector('pre')
            const element = await page.$('pre')
            const videoListData = await page.evaluate(el => el.textContent, element)
            if(videoListData) {
                const videoList = JSON.parse(videoListData)
                if(videoList?.itemList) {
                    const beautifyVideoList = await beautify(videoList.itemList.slice(0, 11))
                    resovle(beautifyVideoList)
                } else {
                    resovle(false)
                }
            } else {
                resovle(false)
            }
        } else {
            resovle(false)
        }
    })
}

const getVideosByAccount = async (account) => {

    return new Promise(async (resovle, reject) => {
        try {
            console.log('tiktok scraping by account....')
            const user = {}

            if(account != '') {
                let localBrowser = null
                if(browser.chromium == null) {
                    localBrowser = await browserLaunch()
                } else {
                    localBrowser = browser.chromium
                }
                const page = await openNewPage(localBrowser, 'account')
                const t = await getAccountInfo(page, account)
                if(t?.userInfo) {
                    user.userInfo = t.userInfo
                    const videoList = await getVideoList(page)
                    if(videoList) {
                        user.items = videoList
                    } else {
                        console.log("not getting video list")
                    }
                    resovle(user)

                } else {
                    console.log("not getting user info")
                    resovle(false)
                }
                
            }
        } catch (error) {
            resovle(error)
        }
    })
}
// ------------------------- ***** account ***** ----------------------------//

// ------------------------- ***** hashtag ***** ----------------------------//
const getSearchResults = async (page, hashtag) => {

    return new Promise(async (resovle, reject) => {
        try {
            console.log('----- getSearchResult ------')

            const appURL = tAppURLs.hashtag.getSearchURL(hashtag)
            
            await page.goto(appURL, {
                waitUntil: 'networkidle2',
            })

            if(apiHashtagURL != '') {

                console.log('---- request hashtag api ------')
                await page.setExtraHTTPHeaders(apiHashtagHeaders)
                await page.goto(apiHashtagURL, {
                    waitUntil: 'domcontentloaded',
                })

                await page.waitForSelector('pre')
                const element = await page.$('pre')
                const videoListData = await page.evaluate(el => el.textContent, element)
                if(videoListData) {
                    const videoList = JSON.parse(videoListData)
                    if(videoList?.item_list) {
                        const beautifyVideoList = await beautify(videoList.item_list)
                        resovle(beautifyVideoList)
                    } else {
                        console.log("not getting item list")
                        resovle(false)
                    }
                } else {
                    console.log("not getting video list")
                    resovle(false)
                }

            } else {
                console.log("not getting hashtag api link")
                resovle(false)
            }

        } catch (error) {
            resovle(error)
        }
    })

}

const getVideosByHashtag = async (hashtag) => {

    return new Promise(async (resovle, reject) => {
        try {

            const hashtagResults = {}
            
            if(hashtag != '') {
                console.log('tiktok scraping by hashtag....')
                const tag = hashtag.replace('#', '')
                let localBrowser = null
                if(browser.chromium == null) {
                    localBrowser = await browserLaunch()
                } else {
                    localBrowser = browser.chromium
                }
                const page = await openNewPage(localBrowser, 'hashtag')
                const t = await getSearchResults(page, tag)
                if(t) {
                    hashtagResults.items = t
                } else {
                    console.log("not getting video list")
                }
                resovle(hashtagResults)
            }

        } catch (error) {
            resovle(false)
        }
    })
}
// ------------------------- ***** hashtag ***** ----------------------------//

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
            const res  = await needle("get", api, {json: true})
            if(res.body?.aweme_list) {
                const aweme = res.body.aweme_list[0]
                if(aweme) {
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

module.exports = {
    browser,
    browserLaunch,
    getVideosByHashtag,
    getVideosByAccount,
    getVideoByURL
}