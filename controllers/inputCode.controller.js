const fs = require('fs-extra')
const CryptoJS = require("crypto-js")
const db = require('../models/index')
const Scraper = require('../scraper/index')
const { appConfig } = require('../config/appConfig')
const { tConfig } = require('../config/tiktokConfig')
const asyncHnadler = require('express-async-handler')

// Create main Model
const Campaign = db.campaigns
const InputCode = db.apiLayouts

// @desc GET inputCode
// @route GET /api/v2/inputCode/
// @access Private
const index = asyncHnadler( async (req, res) => {

    const userId = 12

    if(!userId) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    
    let inputCodes = await InputCode.findAll({ 
        include: [ 
            {
                model: Campaign,
                required: true,
                where: {
                    userId: userId
                },
            }, 
        ],
    })
    res.send(inputCodes)

})

// @desc POST update-layouttype
// @route POST /api/v2/inputCode/update/layoutType
// @access Private
const updateLayoutType = asyncHnadler( async (req, res) => {

    const { id, layoutType } = req.body
    const userId = 12

    if(id === undefined || layoutType === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }

    console.log(id)
    console.log(layoutType)
    
    try {
        const inputCode = await InputCode.update({ layoutType: layoutType }, {
            where: {
                id: id,
            }
        })

        if(inputCode) {
            res.json(true)
        } else {
            res.json(false)
        }

    } catch (error) {
        console.log(error)
        res.json(false)
    }

    

})

// @desc POST updatelayoutContent
// @route POST /api/v2/inputCode/update/layoutContent
// @access Private
const updatelayoutContent = asyncHnadler( async (req, res) => {

    const { id, val, type } = req.body
    const userId = 12

    if(id === undefined || val === undefined || type === undefined) {
        res.status(400).send({ error: { required: 'Please add all fields' } })
        throw new Error('Please add all fields')
    }
    
    try {
        
        if(type == 'account') {
            const inputCode = await InputCode.update({ showAccount: val }, {
                where: {
                    id: id,
                }
            })
            if(inputCode) {
                res.json(true)
            } else {
                res.json(false)
            }
        } else if(type == 'title') {
            const inputCode = await InputCode.update({ showTitle: val }, {
                where: {
                    id: id,
                }
            })
            if(inputCode) {
                res.json(true)
            } else {
                res.json(false)
            }
        } else if(type == 'hashtag') {
            const inputCode = await InputCode.update({ showHashtag: val }, {
                where: {
                    id: id,
                }
            })
            if(inputCode) {
                res.json(true)
            } else {
                res.json(false)
            }
        }

        

    } catch (error) {
        console.log(error)
        res.json(false)
    }

    

})


module.exports = {
    index,
    updateLayoutType,
    updatelayoutContent
}