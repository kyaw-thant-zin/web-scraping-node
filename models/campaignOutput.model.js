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
        visibility: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        linkUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        priority: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        campaignId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'campaigns',
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

    const CampaignOutput = sequelize.define('campaignOutputs', modelAttrs, modelOpts)

    return CampaignOutput

}