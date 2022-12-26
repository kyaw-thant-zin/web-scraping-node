// index.js

/**
 * Required External Modules
 */
const express = require("express")
const puppeteer = require('puppeteer')

/**
 * App Variables
 */
const app = express()
const port = process.env.PORT || "8000"


/**
 *  App Configuration
 */

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

    /**
     * Browser Setting
    **/
    const browserSetting = {
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }

   

    puppeteer.launch( browserSetting ).then(async browser => {
        
        console.log("open new tab")
        const page = await browser.newPage()

        console.log("go to website")
        await page.goto('https://google.com', {
            waitUntil: 'networkidle0',
        })


        await page.waitForTimeout(5000)
        await browser.close()

    });
    

})