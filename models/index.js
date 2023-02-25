const dbConfig = require('../config/dbConfig')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.NAME,
    dbConfig.USER,
    dbConfig.PASS,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        dialectOptions: {
            useUTC: false,
            timezone: process.env.DB_TIMEZONE,
        },
        timezone: process.env.DB_TIMEZONE,
        operatorsAliases: 'false',
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

/**
 *  Connect DB
 */
sequelize.authenticate()
.then(() => console.log('connected.....') )
.catch((err) => console.log(err) )

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

/**
 *  Set Tables
 */

db.roles = require('./role.model')(sequelize, DataTypes)
db.userTypes = require('./userType.model')(sequelize, DataTypes)
db.users = require('./user.model')(sequelize, DataTypes)

db.collectionTypes = require('./collectionType.model')(sequelize, DataTypes)
db.linkTypes = require('./linkType.model')(sequelize, DataTypes)

db.campaigns = require('./campaign.model')(sequelize, DataTypes)
db.tUsers = require('./tUser.model')(sequelize, DataTypes)
db.tHashtags = require('./tHashtag.model')(sequelize, DataTypes)
db.tVideos = require('./tVideo.model')(sequelize, DataTypes)
db.linkSettings = require('./linkSetting.model')(sequelize, DataTypes)
db.apiLayouts = require('./apiLayout.model')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => console.log('re-sync done!') )


/**
 *  Eager Loading
 */
db.roles.hasOne(db.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // roles => user
db.users.belongsTo(db.roles) // user => roles

db.users.hasOne(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // users => campaign
db.campaigns.belongsTo(db.users) // campaign => users

db.collectionTypes.hasOne(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // collectionType => campaign
db.campaigns.belongsTo(db.collectionTypes) // campaign => collectionType

db.linkTypes.hasOne(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // linkType => campaign
db.campaigns.belongsTo(db.linkTypes) // campaign => linkType

db.campaigns.hasOne(db.tUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // campaigns => tUsers
db.tUsers.belongsTo(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tUsers => campaigns

db.campaigns.hasOne(db.tHashtags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // campaigns => tHashtags
db.tHashtags.belongsTo(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tHashtags => campaigns

db.campaigns.hasOne(db.apiLayouts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // campaigns => apiLayouts
db.apiLayouts.belongsTo(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // apiLayouts => campaigns

db.tUsers.hasOne(db.tVideos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tUsers => tVideos
db.tVideos.belongsTo(db.tUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tVideos => tUsers

db.tHashtags.hasOne(db.tVideos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tHashtags => tVideos
db.tVideos.belongsTo(db.tHashtags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tVideos => tHashtags

db.tVideos.hasMany(db.linkSettings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // tVideos => linkSettings
db.linkSettings.belongsTo(db.tVideos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // linkSettings => tVideos


module.exports = db