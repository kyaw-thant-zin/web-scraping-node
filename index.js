const dotenv = require('dotenv').config({
    path: __dirname + '/.env'
})
const cors = require('cors')
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const cookieParser = require('cookie-parser')
const passport = require('passport')
const { passportConfig } = require("./config/passportConfig")
const Schedule = require("./event/index")
const { chromium, firefox, webkit, devices } = require('playwright')


/**
 * App Variables
 */
const app = express()
const port = process.env.PORT || "8000"


/**
 *  App Configuration
 */
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(cookieParser("secretcode"))
app.use(
    session({
      secret: "secretcode",
      resave: false,
      saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())
passportConfig()

/**
 * Routes Definitions
 */
// app.get("/", (req, res) => {
//     res.status(200).send("Happy Scraping!")
// })

// AUTH ROUTES
app.use('/api/v2/user', require('./routes/auth.routes')) // auth

// COLLECTION TYPE ROUTES
app.use('/api/v2/collection-types', require('./routes/collectionType.routes')) // collection type

// LINK TYPE ROUTES
app.use('/api/v2/link-types', require('./routes/linkType.routes')) // link type

// CAMPAIGN ROUTES
app.use('/api/v2/campaign', require('./routes/campaign.routes')) // campaign

// CAMPAIGN OUTPUT ROUTES
app.use('/api/v2/campaignOutput', require('./routes/campaignOutput.routes')) // campaignOutput

// INPUT CODE ROUTES
app.use('/api/v2/inputCode', require('./routes/inputCode.routes')) // inputCode

// LINK SETTING ROUTES
app.use('/api/v2/linkSetting', require('./routes/linkSetting.routes')) // linkSetting

// CDN ROUTES
app.use('/v1/api/', require('./routes/cdn.routes')) // linkSetting

/**
 * Server Activation
 */
const root = require('path').join(__dirname, './views', 'dist')
app.use(express.static(root))
app.get('*', (req, res) => {
    console.log(req.originalUrl)
    res.sendFile('index.html', { root })
})


const browser = {
    userDir: './profiles',
    authFile: './.auth/auth.json',
    devices: {
        'DesktopChrome': devices['Desktop Chrome HiDPI']
    },
    loginURL: 'https://www.tiktok.com/login/phone-or-email/email'
}

app.listen(port, async () => {

    console.log(`Listening to requests on http://localhost:${port}`)

    // check and update video URL
    // Schedule.updateTVideoURL()

    browser.chromium = await chromium.launchPersistentContext('./profiles', { 
        slowMo: 20,
        headless: false,
        ...browser.devices.DesktopChrome,
        locale: 'ja-Jp',
        timezoneId: 'Asia/Tokyo',
        geolocation: { longitude: 139.6786764, latitude: 35.6203313 },
        permissions: ['geolocation'],
        storageState: browser.authFile,
    })
    console.log('Browser is running......')

    page = await browser.chromium.newPage({
        // ...browser.devices.DesktopChrome,
        // geolocation: { longitude: 48.858455, latitude: 2.294474 },
        // permissions: ['geolocation'],
        // storageState: browser.authFile,
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

})