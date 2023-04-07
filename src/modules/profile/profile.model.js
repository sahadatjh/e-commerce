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
        descrition: {
            allowNull: true,
            type: DataTypes.STRING
        },
        created_by: {
            allowNull: true,
            type: DataTypes.UUID,
        },
        updated_by: {
            allowNull: true,
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