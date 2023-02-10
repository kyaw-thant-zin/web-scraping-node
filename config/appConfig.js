
const appConfig = {
    "port": process.env.PORT || "8000",
    "screctKey": 'webapp0.2',
    "key": {
        "visibility": false,
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