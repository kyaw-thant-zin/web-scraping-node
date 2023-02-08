const fs = require("fs")
const url = require("url")
const path = require("path")
const util = require('util')

const crypto = require('crypto')
const express = require("express")
const {executablePath} = require('puppeteer')
const puppeteer = require('puppeteer-extra')
const PuppeteerHar = require('puppeteer-har')
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

// Browser Setting
const browserSetting = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1000,1080', '--use-gl=egl', '--disable-dev-shm-usage'],
    ignoreDefaultArgs: ['--disable-extensions'],
    executablePath: executablePath(),
}

let mainBrowser = {}

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

// launch the browser and go to tiktok
const launchAndGo = async (scrapingMethod) => {
    return new Promise(async (resovle, reject) => {
        try {
            const browser = await puppeteer.launch( browserSetting )
            mainBrowser = browser

            // Create a new page
            const page = await browser.newPage()

            // Disable Cache
            await page.setCacheEnabled(chromiumPage.setCacheEnabled)

            // Set Browser Width and Height
            await page.setViewport(chromiumPage.setViewport)

            // prevent timeout error
            await page.setDefaultNavigationTimeout(chromiumPage.setDefaultNavigationTimeout)

            await page.setRequestInterception(chromiumPage.setRequestInterception)

            // skip unnecessary network requests
            const newPage = await skipUnnecessaryRequests( scrapingMethod, page)

            resovle(newPage)

        } catch (error) {
            resovle(error)
        }
    })
}

// skip unnecessary network requests
const skipUnnecessaryRequests = async (scrapingMethod, page) => {

    return new Promise(async (resovle, reject) => {
        try {
            if(scrapingMethod === 'account') {
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
            }
        } catch (error) {
            resovle(error)
        }
    })

}

// beautify data
const beautify = async (videoList) => {
    return new Promise(async (resovle, reject) => {
        try {
            console.log('----- beautify ------')
            if(videoList && videoList.length > 0) {
                const videoListKey = ['id', 'stats', 'createTime', 'desc', 'video']
                const videoKey = ['id', 'format', 'duration', 'originCover', 'playAddr', 'videoQuality']
                let bVideoList = []
                videoList.forEach(video => {
                    const dumpVideo = {}
                    for(const key in video) {
                        if(videoListKey.includes(key)) {
                            if(key == 'video') {
                                const videoObj = video[key]
                                const dumpVideoChild = {}
                                for(const childKey in videoObj) {
                                    if(videoKey.includes(childKey)) {
                                        dumpVideoChild[childKey] = videoObj[childKey]
                                    }
                                }
                                dumpVideo[key] = dumpVideoChild
                            } else {
                                dumpVideo[key] = video[key]
                            }
                        }
                    }
                    bVideoList.push(dumpVideo)
                })
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
                    const beautifyVideoList = await beautify(videoList.itemList)
                    resovle(beautifyVideoList)
                } else {
                    resovle({})
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

            const user = {}

            if(account != '') {
                const page = await launchAndGo('account')
                const t = await getAccountInfo(page, account)
                if(t?.userInfo) {
                    user.userInfo = t.userInfo
                    const videoList = await getVideoList(page)
                    if(videoList) {
                        user.items = videoList
                    } 
                    await allDone(page)
                    resovle(user)

                } else {
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
const getVideosByHashtag = async (hashtag) => {

    return new Promise(async (resovle, reject) => {
        try {
            console.log('tiktok scraping by hashtag....')
            
            const page = await launchAndGo()

        } catch (error) {
            
        }
    })
}
// ------------------------- ***** hashtag ***** ----------------------------//

module.exports = {
    getVideosByHashtag,
    getVideosByAccount
}