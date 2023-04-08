const sequelize = require('../../config/lib/sequelize');
const { DataTypes, UUID } = require('sequelize');
const Permission = require( './permission.model' );
const Service = require( '../service/service.model' );

const ServicePermission = sequelize.define(
    'service_permissions',
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        service_id: {
            type: DataTypes.UUID
        },
        permission_id: {
            type: DataTypes.UUID
        }
    },
    {
        tableName: 'service_permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

Permission.hasMany( ServicePermission, { 
    as: 'servicePermissions',
    foreignKey: 'permission_id'
});

ServicePermission.belongsTo(Permission, { 
    as: 'permission',
    foreignKey: 'permission_id'
})

ServicePermission.belongsTo(Service, { 
    as: 'service',
    foreignKey: 'service_id'
})

Service.hasMany( ServicePermission, { 
    as: 'servicePermissions',
    foreignKey: 'service_id'
});

module.exports = ServicePermission;   