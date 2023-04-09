const sequelize = require('../../config/lib/sequelize');
const { DataTypes, UUID } = require('sequelize');
const Profile = require( './profile.model' );
const Permission = require( '../permission/permission.model' );

const ProfilePermission = sequelize.define(
    'profile_permissions',
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        profile_id: {
            type: DataTypes.UUID
        },
        permission_id: {
            type: DataTypes.UUID
        }
    },
    {
        tableName: 'profile_permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

Profile.hasMany( ProfilePermission, { 
    as: 'profilePermissions',
    foreignKey: 'profile_id'
});

ProfilePermission.belongsTo(Permission, { 
    as: 'permission',
    foreignKey: 'permission_id'
})

ProfilePermission.belongsTo(Profile, { 
    as: 'profile',
    foreignKey: 'profile_id'
})

Permission.hasMany( ProfilePermission, { 
    as: 'profilePermissions',
    foreignKey: 'permission_id'
});


module.exports = ProfilePermission;   