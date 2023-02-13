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
        videoId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        playCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        diggCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        commentCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shareCount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        originCoverURL: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        videoURL: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        webVideoURL: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expiresIn: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        tUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tUsers',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        tHashtagId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tHashtags',
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

    const TVideo = sequelize.define('tVideos', modelAttrs, modelOpts)

    return TVideo

}