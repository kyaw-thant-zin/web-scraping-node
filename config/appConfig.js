
const appConfig = {
    "port": process.env.PORT || "8000",
    "secretKey": 'webapp0.2',
    "key": {
        "visibility": true,
        "priority": false,
        "layoutType": "12",
        "showAccount": true,
        "showTitle": true,
        "showHashtag": true
    }
}

module.exports = {
    appConfig
}