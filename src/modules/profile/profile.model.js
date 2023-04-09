const sequelize = require('../../config/lib/sequelize');
const { DataTypes, UUID } = require('sequelize');

const Profile = sequelize.define(
    'profiles',
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            allowNull: true,
            type: DataTypes.JSON
        },
        type: {
            type: DataTypes.ENUM,
            values: ['standard', 'custom'],
            defaultValue: 'custom'
        },
        created_by: {
            type: DataTypes.UUID,
        },
        updated_by: {
            type: DataTypes.UUID,
        }
    },
    {
        tableName: 'profiles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

module.exports = Profile;   