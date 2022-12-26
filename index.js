// index.js

/**
 * Required External Modules
 */

const url = require("url")
const path = require("path")
const express = require("express")
const puppeteer = require('puppeteer-extra')
const {executablePath} = require('puppeteer')
const PuppeteerHar = require('puppeteer-har')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

const fs = require("fs")

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

    res.status(200).send("WHATABYTE: Food For Devs")
});

/**
 * Server Activation
 */
app.listen(port, () => {

    console.log(`Listening to requests on http://localhost:${port}`)

    const browserSetting = {
        headless: false,
        devtools: false,
        // args: ['--no-sandbox'],
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // executablePath: executablePath(),
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        // product: 'chrome'
    }

    puppeteer.launch(browserSetting).then(async browser => {

        console.log('Running tests....')
        const page = await browser.newPage()

        // await page.setDefaultNavigationTimeout(0)

        await page.setExtraHTTPHeaders({
            // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            // 'accept-encoding': 'gzip, deflate, br',
            // 'accept-language': 'en-US,en;q=0.9,en;q=0.8'
        })

        const har = new PuppeteerHar(page)
        const harSetting = { 
            path: 'results.har', 
            saveResponse: true, 
            captureMimeTypes: ['application/json']
        }
        await har.start(harSetting)
        console.log("Go TikTok......")
        await page.goto('https://www.tiktok.com/', {
            waitUntil: 'networkidle0',
        })
        await page.setDefaultNavigationTimeout(0)
        console.log("Go to profile.....")
        await page.goto('https://www.tiktok.com/@mizar449', {
            waitUntil: 'networkidle0',
        })
        console.log("Load profile.....")
        await page.waitForTimeout(5000)
        const lastPosition = await scrollPageToBottom(page, {
            size: 2500,
            delay: 250
        })
        console.log("page scroll")
        // await page.reload()
        await page.waitForTimeout(5000)
        // await page.screenshot({       
        //     path: "screenshot.png",      
        //     fullPage: true        
        // })
        await page.waitForTimeout(3000)
        // console.log("Page take screenshot")
        console.log("Wait to take har.....")
        await har.stop()
        console.log("stop har.....")
        await page.waitForTimeout(5000)


        console.log("Read har.....")
        const fileContents = fs.readFileSync("results.har")
        const jsonContents = JSON.parse(fileContents)

        console.log("filter har.....")
        console.log(jsonContents.log.entries.length)
        const filtered = jsonContents.log.entries.filter((element) => {
            return element.request.url.includes("api/user/detail") || element.request.url.includes("api/post/item_list")
            // return element.request.url.includes("api/user/detail") || element.request.url.includes("api/post/item_list")
            // return element.request.url.includes("api/user/detail") || element.request.url.includes("node/share/discover")
        })
        
        let profileURLQuery = {}
        let userInfo = {}

        if(filtered.length > 0) {
            // last URL
            // const lastData = filtered[filtered.length - 1]
            filtered.forEach((element) => {
                console.log(element.request.url)
                console.log(element.response.content)
                console.log("---------------------------------------------------------------------------------------")
            })
            // const profileURL = url.parse(lastData.request.url, true)
            // profileURLQuery = profileURL.query
            // userInfo = JSON.parse(lastData.response?.content?.text).userInfo
        }

        // console.log(profileURLQuery)
        // console.log(userInfo)

        // filtered.forEach((element) => {
        //     console.log(element.request.url)
        // })
        // console.log(jsonContents.log.entries)

        // console.log("Fetch Cookie.....")
        // const cookies = await page.cookies()
        // console.log("Print Cookie.....")
        // console.log(cookies)

        await page.close()
        console.log("Page closed!")
        await browser.close()
        console.log("Browser closed!")

    })

});