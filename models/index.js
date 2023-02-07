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

db.users.hasMany(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // users => campaign
db.campaigns.belongsTo(db.users) // campaign => users

db.collectionTypes.hasMany(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // collectionType => campaign
db.campaigns.belongsTo(db.collectionTypes) // campaign => collectionType

db.linkTypes.hasMany(db.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
}) // linkType => campaign
db.campaigns.belongsTo(db.linkTypes) // campaign => linkType

module.exports = db