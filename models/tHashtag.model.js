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
        hashtag: {
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

    const THashtag = sequelize.define('tHashtags', modelAttrs, modelOpts)

    return THashtag

}