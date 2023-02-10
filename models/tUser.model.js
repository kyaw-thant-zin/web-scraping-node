const { Deferrable } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

    const modelAttrs = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: sequelize.literal('UUID()'),
            unique: 'uuid',
        },
        accountId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uniqueId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        followerCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        followingCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        videoCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        heartCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatarLarger: {
            type: DataTypes.STRING,
            allowNull: false
        },
        campaignOutputId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'campaignOutputs',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
    }

    const modelOpts = {
        timestamps: true,
        createdAt: 'createTimestamp',
        updatedAt: 'updateTimestamp'
    }

    const TUser = sequelize.define('tUsers', modelAttrs, modelOpts)

    return TUser

}