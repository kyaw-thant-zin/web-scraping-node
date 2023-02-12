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
const { browserLaunch } = require('./scraper/TikTok')


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
app.get("/", (req, res) => {
    res.status(200).send("Happy Scraping!")
})

// AUTH ROUTES
app.use('/api/v2/user', require('./routes/auth.routes')) // auth

// COLLECTION TYPE ROUTES
app.use('/api/v2/collection-types', require('./routes/collectionType.routes')) // collection type

// LINK TYPE ROUTES
app.use('/api/v2/link-types', require('./routes/linkType.routes')) // link type

// CAMPAIGN ROUTES
app.use('/api/v2/campaign', require('./routes/campaign.routes')) // campaign

/**
 * Server Activation
 */
// const root = require('path').join(__dirname, './views', 'dist')
// console.log(root)
// app.use(express.static(root))
// app.get('*', (req, res) => {
//     console.log(req.originalUrl)
//     res.sendFile('index.html', { root })
// })


app.listen(port, async () => {

    console.log(`Listening to requests on http://localhost:${port}`)

    const browser = await browserLaunch()
    const page = await browser.newPage()
    
            await page.setCacheEnabled(true)
    
            // // prevent timeout error
            await page.setDefaultNavigationTimeout(0)

            await page.goto('https://www.tiktok.com/', {
                waitUntil: 'networkidle2',
            })

})