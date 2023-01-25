// index.js

/**
 * Required External Modules
 */
const util = require('util');
const crypto = require('crypto');
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

    // let query_str = {
    //     aid: '1988',
    //     app_name: 'tiktok_web',
    //     battery_info: '1',
    //     browser_language: 'en-US',
    //     browser_name: 'Mozilla',
    //     browser_online: 'true',
    //     browser_platform: 'MacIntel',
    //     browser_version: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5412.0 Safari/537.36',
    //     channel: 'tiktok_web',
    //     cookie_enabled: 'true',
    //     device_id: '7192173153236665858',
    //     device_platform: 'web_pc',
    //     focus_state: 'true',
    //     from_page: 'user',
    //     history_len: '2',
    //     is_fullscreen: 'false',
    //     is_page_visible: 'true',
    //     os: 'mac',
    //     priority_region: '',
    //     referer: '',
    //     region: 'MM',
    //     screen_height: '1080',
    //     screen_width: '1920',
    //     tz_name: 'Asia/Rangoon',
    //     webcast_language: 'en',
    //     secUid: 'MS4wLjABAAAAFiFER5ePUCnzfkLUT5XSZxcMk19LlHLCyukuOEOHaRtZ4ATWx8UNvcjz3ZoAUs8h',
    //     cursor: 0,
    //     count: 12,
    //     is_encryption: 1
    // }

    // const hash = `4mOJhGnMOdadxrLEy2bkmGSR2R38w8nZC8MQKREioTAU76aXIbW+KkRzj5O7qqbOI65rqSqkFAXNltiJ1p2YyvalYQ0VbxXkcXRyJfQSSRTk/fBab3EehOQzE3c0VGxjxseLL/pHkdwZOFy6VkLtsE4Ns79k9Ml+TOiWRhATOkL0q+6xkK/JZAE0Nf6Et/1QeuT9i33Trcq/tjVUxJqmW84vxO/sGvJGiQm1pS84ILhn6n9XVKXoXjyYRiiK8oma4hqXehJM6DBo7knM0OUBW2s7N11xex8Kgk5aIysnTy9x9ldKreqOavDPsBuiglh/VnRESLD6yJXoPkm6xu922kgdYTWtcdcx57BYGqk7xO3RPKC3AoMy69yurRerU3okvfyPWJ6DRbsCOXjltcURAnkbTEdSMuCCx+Z+X5+RFxGKOPckSK7eLP2fHzHZP/ILcJXTVjHr0nPG3Ag9uPaa0BpM1i+j2O+b8Oql72biaD0DyIQ2oon53GWEhPI2TNepZH5WzYKzw4qRp59tMLJLzG4t3sWH7hpEQ/f+7XrTqRvJquveRjvyFT+YUktiKTqCAogNF7YZln+1uPCs0jdkb8aLG+cjhNw0Mgq0ByQuJeYGX4AV2CPgG+kbfxtdCHtdmJad7Hgu0u/7ZU32hKtqCVA41PNQvHeE9QlS66Lnrtcn8hywIjZIYrH/jB9d4W1+Tn6mInawE8aPNfXFL4+kCL3MUS6Y/CcyBYxKR5QmKt2yq2fKYfXitWmkWeDKd+8eXHaonhWjdEIzXYiA43miDdhYI3Zp9cCBkRu9o8zCkc1bG0QuqnulDypWLt5CcH9Uw+p4FwO37NWsZlz5zaxHKb3eJ3a8OjpCatrVNSqDFKZTao8RYTVIyCOOlxFGJjTVJVHpmtijiivPoLF4p0vTtiUbletDVbWu6caZn2MRIolFC/Coohu95hJOuXWq3XoWYlYfXiC4GkpuqdztJV6RbMbqJg/uQv5Npthmu7TgqOfnozJopX7JJmkXdWL/VJR8pTUZrDCSd0awXEGEt0/W6B6ITZ49eRhIVy3Z36O522Y32NkGHoPkQC/ebXpSvlWnCwwkZiZoTbbbTqCKRg69w629Y3TKQ2xoWzh/F6PFkfPtzz0m5/6OciGMQkenmXD0RpavnR/TMZPOk+1Nl8ZGtA==`
    // TIKTOK SecretKey
    const secretKey = "webapp1.0+202106";
    // Defining algorithm
    const algorithm = 'aes-128-cbc';

    // // Decrypt
    // const decipher = crypto.createDecipheriv(algorithm, secretKey, secretKey)
    // const decrpyted = Buffer.concat([decipher.update(hash, 'base64'), decipher.final()])
    // console.log(decrpyted.toString("utf-8"))
    // console.log('--------------------------------------------------------------------------------------------------')
    // // Encrypt
    // const str = new URLSearchParams(query_str).toString()
    // console.log(str)
    // const cipher = crypto.createCipheriv(algorithm, secretKey, secretKey)
    // const crpyted = Buffer.concat([cipher.update(str), cipher.final()])
    // console.log(crpyted)
    // console.log(crpyted.toString("base64"))


    console.log('Open browser')

    // // Browser Setting
    const browserSetting = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1000,1080', '--use-gl=egl', '--disable-dev-shm-usage'],
        ignoreDefaultArgs: ['--disable-extensions'],
        executablePath: executablePath(),

    }

    // // Profile URL
    // let apiProfileURL = 'https://www.tiktok.com/api/user/detail';

    // // launch browser
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
        // console.log("Go TikTok......")
        // await page.goto('https://www.tiktok.com/', {
        //     waitUntil: 'networkidle0',
        // })

        // start recording har
        await har.start(harSetting)

        // go to profile
        console.log("Go to profile.....")
        await page.goto('https://www.tiktok.com/@xiaruihann', {
            waitUntil: 'networkidle0',
        })

        console.log("page scroll")
        const lastPosition = await scrollPageToBottom(page, {
            size: 2500,
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

    //     // filter the har file JSON object
        console.log("filter har.....")
        console.log(jsonContents.log.entries.length)
        const filtered = jsonContents.log.entries.filter((element) => {
            return element.request.url.includes("api/user/detail") || element.request.url.includes("api/post/item_list")
            // return element.request.url.includes("api/post/item_list")
        })

        let profileURLQuery = {}
        let videoListURLQuery = {}
        let userInfo = {}
        let videoList = {}
        let freshApiProfileURL = ''
        let videoListXTTParams = ''

        if(filtered.length > 0) {
            // last URL
            // const lastData = filtered[filtered.length - 1]
            filtered.forEach( async (element) => {

                if(element.request.url.includes("api/user/detail")) {
                    // profile URL
                    const profileURL = url.parse(element.request.url, true)
                    freshApiProfileURL = element.request.url
                    profileURLQuery = profileURL.query
                    userInfo = element.response?.content
                    userInfo = JSON.parse(element.response?.content?.text).userInfo
                    console.log(userInfo)
                    console.log("----------------------------------------------------------------")
                } else if(element.request.url.includes("api/post/item_list")) {
                    // video list URL
                    // const videoListURL = url.parse(element.request.url, true)
                    // videoListURLQuery = videoListURL.query
                    videoListURLQuery = element.request.url
                    element.request.headers.forEach(element => {
                        if(element.name === 'x-tt-params') {
                            videoListXTTParams = element.value
                        }
                    });
                    
                    // videoList = element.response?.content
                    // videoList = JSON.parse(element.response?.content?.text)
                    // console.log(videoList)
                    // console.log("----------------------------------------------------------------")
                }
            })
            
        }
        // console.log(videoListXTTParams)
        // console.log("----------------------------------------------------------------")
        const decipher = crypto.createDecipheriv(algorithm, secretKey, secretKey)
        const decrpyted = Buffer.concat([decipher.update(videoListXTTParams, 'base64'), decipher.final()])
        const decrpytedVideoListParams = decrpyted.toString("utf-8")
        const decrpytedVideoListQuery = new URLSearchParams(decrpytedVideoListParams)
        decrpytedVideoListQuery.set('cursor', 0)
        console.log(decrpytedVideoListQuery)

        // const apiListurl = new URL('https://www.tiktok.com/api/post/item_list');
        // console.log(decrpytedVideoListQuery.verifyFp)
        // videoListURLQuery.verifyFp = decrpytedVideoListQuery.verifyFp
        // apiListurl.search = new URLSearchParams(videoListURLQuery);

        // // Encrypt
        const str = new URLSearchParams(decrpytedVideoListQuery).toString()
        console.log(str)
        const cipher = crypto.createCipheriv(algorithm, secretKey, secretKey)
        const crpyted = Buffer.concat([cipher.update(str), cipher.final()])
        const xttParams = crpyted.toString("base64")
        // console.log("----------------------------------------------------------------")
        // console.log(xttParams)
        await page.setExtraHTTPHeaders({
            'x-tt-params': xttParams
        })
        // console.log("----------------------------------------------------------------")
        // console.log(apiListurl.href)
        await page.goto(videoListURLQuery, {
            waitUntil: 'domcontentloaded',
        })

        await page.waitForSelector('pre')
        const element = await page.$('pre')
        const profileInfo = await page.evaluate(el => el.textContent, element)
        console.log(JSON.parse(profileInfo))

        // if(!Object.keys(videoListURLQuery).length) {

        //     const url = new URL('https://www.tiktok.com/api/post/item_list');
        //     url.search = new URLSearchParams(videoListURLQuery);

        //     // Encrypt
        //     const str = new URLSearchParams(videoListURLQuery).toString()
        //     console.log(str)
        //     const cipher = crypto.createCipheriv(algorithm, secretKey, secretKey)
        //     const crpyted = Buffer.concat([cipher.update(str), cipher.final()])
        //     const xttParams = crpyted.toString("base64")

        //     await page.setExtraHTTPHeaders({
        //         'sec-ch-ua-mobile': '?0',
        //         'sec-ch-ua-platform': "macOS",
        //         'sec-fetch-dest': 'empty',
        //         'sec-fetch-mode': 'cors',
        //         'sec-fetch-site': 'same-origin',
        //         'x-tt-params': xttParams
        //     })
            
        //     await page.goto(url.href, {
        //         waitUntil: 'domcontentloaded',
        //     })

        //     // await page.waitForSelector('pre')
        //     // const element = await page.$('pre')
        //     // const profileInfo = await page.evaluate(el => el.textContent, element)
        //     const profileInfo = await page.content()
        //     console.log('Content - '+profileInfo)

        // } else {
        //     const url = new URL('https://www.tiktok.com/api/post/item_list');
        //     url.search = new URLSearchParams(videoListURLQuery);

        //     console.log(url.href)
            
        //     // await page.goto(url.href, {
        //     //     waitUntil: 'domcontentloaded',
        //     // })

        //     // await page.waitForSelector('pre')
        //     // const element = await page.$('pre')
        //     // const profileInfo = await page.evaluate(el => el.textContent, element)
        //     // const profileInfo = await page.content()

        //     // console.log('Content - '+profileInfo)
        // }


        // let tiktokParams = {}

        // if(filtered.length > 0) {
        //     const lastData = filtered[filtered.length - 1]
        //     const recommendItemURL = url.parse(lastData.request.url, true)
        //     tiktokParams = recommendItemURL.query
        // }

        // apiProfileURL = new URL(apiProfileURL)
        // apiProfileURL.search = new URLSearchParams(tiktokParams)
        // console.log(apiProfileURL.href)

        // // scrape profile
        // console.log("Go to profile.....")
        // await page.goto(apiProfileURL.href, {
        //     waitUntil: 'networkidle0',
        // })

        // const pageContent = await page.content()

        // console.log(pageContent)

    //     // await page.goto(freshApiProfileURL, {
    //     //     waitUntil: 'domcontentloaded',
    //     // })

    //     // await page.waitForSelector('pre')
    //     // const element = await page.$('pre')
    //     // const profileInfo = await page.evaluate(el => el.textContent, element)

    //     // console.log(profileInfo)

    //     // const profileInfoObj = JSON.parse(profileInfo).userInfo

    //     // console.log(profileInfoObj.user.secUid)
    //     // console.log(profileInfoObj.user.uniqueId)

    //     // console.log(profileURLQuery)
    //     // console.log(userInfo)
    //     console.log("----------------------------------------------------------------")
    //     // console.log(videoListURLQuery)
    //     // console.log(videoList)

        await page.close()
        console.log("Page closed!")
        await browser.close()
        console.log("Browser closed!")

    //     // remove har file
    //     // fs.unlinkSync('results.har')

    });
    

})