const cors = require('cors')
const express = require("express")
const cookieParser = require('cookie-parser')

const dotenv = require('dotenv').config({
    path: __dirname + '/.env'
})

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
app.use(cookieParser())

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.status(200).send("Happy Scraping!")
})

// AUTH ROUTES
app.use('/api/v2/user', require('./routes/auth.routes')) // auth

/**
 * Server Activation
 */
const root = require('path').join(__dirname, './views', 'dist')
console.log(root)
app.use(express.static(root))
app.get('*', (req, res) => {
    res.sendFile('index.html', { root })
})


app.listen(port, () => {

    console.log(`Listening to requests on http://localhost:${port}`)

    

})