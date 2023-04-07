const sequelize = require('../../config/lib/sequelize');
const { DataTypes, UUID } = require('sequelize');

const Permission = sequelize.define(
    'permissions',
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
        tableName: 'permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

module.exports = Permission;   