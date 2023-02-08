
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
    chromiumPage
}