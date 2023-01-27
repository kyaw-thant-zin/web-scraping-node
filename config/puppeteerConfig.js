const { executablePath } = require("puppeteer")

const chromiumBrowser = {
    "setting": {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1000,1080", "--use-gl=egl", "--disable-dev-shm-usage"],
        ignoreDefaultArgs: ["--disable-extensions"],
        executablePath: executablePath(),
    },
}

const chromiumPage = {
    "setCacheEnabled": true,
    "setViewport": {
        "width": 390,
        "height": 844
    },
    "setDefaultNavigationTimeout": 0,
    "setRequestInterception": true,
    "removeResourceTypes": ["image", "font", "other", "media"],
    "resourceTypes": {
        "fetch": "fetch",
        "script": "script",
        "xhr": "xhr",

    },
    "waitUntil": {
        "networkidle0": "networkidle0",
        "domcontentloaded": "domcontentloaded"
    },
    "scrollSetting": {
        "size": 500,
        "delay": 250
    },
    "contentSelector": "pre",
}




module.exports = {
    chromiumBrowser,
    chromiumPage
}