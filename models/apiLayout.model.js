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
        layoutType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        showAccount: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        showTitle: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        showHashtag: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        apiToken: {
            type: DataTypes.TEXT,
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

    const ApiLayout = sequelize.define('apiLayouts', modelAttrs, modelOpts)

    return ApiLayout

}