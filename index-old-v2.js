const fs = require("fs")
const url = require("url")
const path = require("path")
const util = require('util')

const crypto = require('crypto')
const express = require("express")
const puppeteer = require('puppeteer-extra')
const {executablePath} = require('puppeteer')
const PuppeteerHar = require('puppeteer-har')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

/**
 * App Variables
 */
const app = express()
const port = process.env.PORT || "8000"

/**
 *  App Configuration
 */
puppeteer.use(StealthPlugin())
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.status(200).send("Happy Scraping!")
})

/**
 * Server Activation
 */
app.listen(port, () => {

    console.log(`Listening to requests on http://localhost:${port}`)

    // TikTok SecretKey
    const secretKey = "webapp1.0+202106";
    // Defining Algorithm
    const algorithm = 'aes-128-cbc';

    // Browser Setting
    const browserSetting = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1000,1080', '--use-gl=egl', '--disable-dev-shm-usage'],
        ignoreDefaultArgs: ['--disable-extensions'],
        executablePath: executablePath(),
    }

    puppeteer.launch( browserSetting ).then(async browser => {

        // Create a new page
        const page = await browser.newPage()

        // Disable Cache
        await page.setCacheEnabled(true)

        // Set Browser Width and Height
        await page.setViewport({ width: 390, height: 844 })

        // Prevent Timeout Error
        await page.setDefaultNavigationTimeout(0)

        await page.setRequestInterception(true)
        let apiUserURL = '';
        let apiUserHeaders = {};
        let apiListURL = '';
        let apiListHeaders = {};
        const removeResourceTypes = ['image', 'font', 'other', 'media']

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
                console.log(request.resourceType())
                request.continue()
            }
        })

        await page.goto('https://www.tiktok.com/@chojudai', {
            waitUntil: 'networkidle0',
        })

        const lastPosition = await scrollPageToBottom(page, {
            size: 500,
            delay: 250
        })

        await page.screenshot({
            path: 'screenshot.jpg'
        })

        await page.setExtraHTTPHeaders(apiUserHeaders)
        await page.goto(apiUserURL, {
            waitUntil: 'domcontentloaded',
        })

        await page.waitForSelector('pre')
        const element = await page.$('pre')
        const profileInfo = await page.evaluate(el => el.textContent, element)
        console.log(JSON.parse(profileInfo))

        console.log("----------------------------------------------------------------")

        if(apiListURL != '') {
            const decipher = crypto.createDecipheriv(algorithm, secretKey, secretKey)
            const decrpyted = Buffer.concat([decipher.update(apiListHeaders['x-tt-params'], 'base64'), decipher.final()])
            const decrpytedVideoListParams = decrpyted.toString("utf-8")
            const decrpytedVideoListQuery = new URLSearchParams(decrpytedVideoListParams)
            decrpytedVideoListQuery.set('cursor', 0)

            const str = new URLSearchParams(decrpytedVideoListQuery).toString()
            const cipher = crypto.createCipheriv(algorithm, secretKey, secretKey)
            const crpyted = Buffer.concat([cipher.update(str), cipher.final()])
            const xttParams = crpyted.toString("base64")
            apiListHeaders['x-tt-params'] = xttParams

            await page.setExtraHTTPHeaders(apiListHeaders)
            await page.goto(apiListURL, {
                waitUntil: 'domcontentloaded',
            })

            await page.waitForSelector('pre')
            const element2 = await page.$('pre')
            const videoListData = await page.evaluate(el => el.textContent, element2)
            const videoList = JSON.parse(videoListData)
            console.log(videoList)
            console.log(videoList.itemList.length)
        }

        await page.close()
        console.log("Page closed!")
        await browser.close()
        console.log("Browser closed!")

    });

})