const fs = require("fs")
const url = require("url")
const path = require("path")
const util = require('util')

const crypto = require('crypto')
const express = require("express")
const puppeteer = require('puppeteer-extra')
const PuppeteerHar = require('puppeteer-har')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

/**
 *  App Configuration
 */
puppeteer.use(StealthPlugin())
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())

