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
        secVideoId: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        priority: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        visibility: {
            type: DataTypes.BOOLEAN,
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
        secVideoURL: {
            type: DataTypes.TEXT,
            allowNull: true
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
        authorUniqueId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        authorNickName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        authorSignature: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        authorAvatarLarger: {
            type: DataTypes.TEXT,
            allowNull: true
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