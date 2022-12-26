// index.js

/**
 * Required External Modules
 */
const fs = require("fs")
const url = require("url")
const path = require("path")
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


    console.log('Open browser')

    // Browser Setting
    const browserSetting = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--use-gl=egl', '--disable-dev-shm-usage'],
        ignoreDefaultArgs: ['--disable-extensions'],
        executablePath: executablePath(),
    }

    // launch browser
    puppeteer.launch( browserSetting ).then(async browser => {
        
        console.log("open new tab")
        // Create a new page
        const page = await browser.newPage()

        // clear cookie
        const client = await page.target().createCDPSession()		
		await client.send('Network.clearBrowserCookies')

        // prevent timeout error
        await page.setDefaultNavigationTimeout(0)

        // init har in page
        const har = new PuppeteerHar(page)
        const harSetting = { 
            path: 'results.har', 
            saveResponse: true, 
            captureMimeTypes: ['application/json']
        }

        // go to home page and init cookie 
        console.log("Go TikTok......")
        await page.goto('https://www.tiktok.com/', {
            waitUntil: 'networkidle0',
        })

        // start recording har
        await har.start(harSetting)

        // go to profile
        console.log("Go to profile.....")
        await page.goto('https://www.tiktok.com/@mizar449', {
            waitUntil: 'networkidle0',
        })

        console.log("page scroll")
        const lastPosition = await scrollPageToBottom(page, {
            size: 1500,
            delay: 250
        })

        // wait 5s for page fully loaded
        console.log("Load profile.....")
        await page.waitForTimeout(5000)

        console.log("stop har.....")
        await har.stop()

        // wait 2s for write har file
        await page.waitForTimeout(5000)

        // read the har file
        console.log("Read har.....")
        const fileContents = fs.readFileSync("results.har")
        const jsonContents = JSON.parse(fileContents)

        // filter the har file JSON object
        console.log("filter har.....")
        console.log(jsonContents.log.entries.length)
        const filtered = jsonContents.log.entries.filter((element) => {
            return element.request.url.includes("api/user/detail") || element.request.url.includes("api/post/item_list")
        })

        let profileURLQuery = {}
        let videoListURLQuery = {}
        let userInfo = {}
        let videoList = {}

        if(filtered.length > 0) {
            // last URL
            // const lastData = filtered[filtered.length - 1]
            filtered.forEach((element) => {

                if(element.request.url.includes("api/user/detail")) {
                    // profile URL
                    const profileURL = url.parse(element.request.url, true)
                    profileURLQuery = profileURL.query
                    userInfo = element.response?.content
                    // userInfo = JSON.parse(element.response?.content?.text).userInfo
                } else if(element.request.url.includes("api/post/item_list")) {
                    // video list URL
                    const videoListURL = url.parse(element.request.url, true)
                    videoListURLQuery = videoListURL.query
                    videoList = element.response?.content
                    // videoList = JSON.parse(element.response?.content?.text)
                }
            })
            
        }

        console.log(profileURLQuery)
        console.log(userInfo)
        console.log("----------------------------------------------------------------")
        console.log(videoListURLQuery)
        console.log(videoList)

        await page.close()
        console.log("Page closed!")
        await browser.close()
        console.log("Browser closed!")

        // remove har file
        // fs.unlinkSync('results.har')

    });
    

})