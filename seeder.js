const path = require('path');
const async = require('async');

async function init() {  
    const config = require('./src/config');
    config.initEnvironmentVariables();

    const sequelize = require('./src/config/lib/sequelize');

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);

    const User = require('./src/modules/user/user.model');
    const Service =  require('./src/modules/service/service.model');
    const Permission = require( './src/modules/permission/permission.model' );
    const ServicePermission = require('./src/modules/permission/service-permission.model');
    const Profile = require('./src/modules/profile/profile.model');
    const ProfilePermission = require('./src/modules/profile/profile-permission.model');
    
    await sequelize.sync();

    function userSeeder(callback) {
        User.findOrCreate({
            where: { email: 'admin@ecommerce.com' },
            defaults: { 
                firstName: "System", 
                lastName: 'Admin', 
                password: 'P@ssword123' 
            }
        }).then((users)=>{
            callback(null, users[0].id);
        })
    }

    function profileSeeder(userId, callback) {
        const profiles = [{ 
            name: 'System Admin', 
            description: 'All operations of the Admin can be done using this profile',
            type: 'standard',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Customer', 
            description: 'All operations of the customer can be done using this profile',
            type: 'standard',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Vendor', 
            description: 'All operations of the vendor can be done using this profile',
            type: 'standard',
            created_by: userId,
            updated_by: userId
        }];

        Profile.destroy({ truncate: { cascade: true } })
            .then(()=>{
                Profile.bulkCreate(profiles, { returning: true, ignoreDuplicates: false }).then(()=>{
                    callback(null, userId);
                })
            });
    } 

    function userUpdateSeeder(userId, callback) {
        User.findOne({ where: { id: userId } })
            .then((admin) => {
                Profile.findOne({ where: { name: 'System Admin'} })
                    .then((systemAdminProfile) => {
                        admin.update({ profile_id: systemAdminProfile.id });

                        callback(null, userId);
                    });
            });
        
    }

    function serviceSeeder(userId, callback) {
        const services = [{ 
            name: 'User Management', 
            description: 'User create, Read, Update, Delete service',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Service Management', 
            description: 'Service create, Read, Update, Delete service',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Profile Management', 
            description: 'Profile create, Read, Update, Delete service',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Permission Management', 
            description: 'Permission create, Read, Update, Delete service',
            created_by: userId,
            updated_by: userId
        }];

        Service.destroy({ truncate: { cascade: true } })
            .then(()=>{
                Service.bulkCreate(services, { returning: true, ignoreDuplicates: false }).then((users)=>{
                    callback(null, userId);
                })
            });
    }
    
    function permissionSeeder(userId, callback) {
        const permissions = [{ 
            name: 'System Admin Permission', 
            description: 'This permission for manage seytem admin',
            type: 'standard',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Vendor Permission', 
            description: 'This permission for manage vendors',
            type: 'standard',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Customer Permision', 
            description: 'This permission for manage customers',
            type: 'standard',
            created_by: userId,
            updated_by: userId
        }];

        Permission.destroy({ truncate: { cascade: true } })
            .then(()=>{
                Permission.bulkCreate(permissions, { returning: true, ignoreDuplicates: false })
                    .then((sers)=>{
                        callback(null, userId);
                    })
            });
    }

    function servicePermissionSeerer(userId, callback) {
        Promise.all([
            Service.findOne({ where: { name: 'User Management'}}),
            Service.findOne({ where: { name: 'Service Management'}}),
            Service.findOne({ where: { name: 'Profile Management'}}),
            Service.findOne({ where: { name: 'Permission Management'}}),

            Permission.findOne({ where: { name: 'System Admin Permission'}}),
            // Permission.findOne({ where: { name: 'Vendor Permission'}}),
            // Permission.findOne({ where: { name: 'Customer Permision'}}),
        ]).then((values) => {
            const [ 
                userManagementService, 
                serviceManagementService, 
                perofileManagementServie, 
                permissionManagementService, 
                systemAdminPermission 
            ] = values;

            const serviePermissions = [
                {
                    service_id: userManagementService.id, 
                    permission_id: systemAdminPermission.id
                },
                {
                    service_id: serviceManagementService.id, 
                    permission_id: systemAdminPermission.id
                },
                {
                    service_id: perofileManagementServie.id, 
                    permission_id: systemAdminPermission.id
                },
                {
                    service_id: permissionManagementService.id, 
                    permission_id: systemAdminPermission.id
                },
            ];

            ServicePermission.destroy({ truncate: { cascade: true } })
            .then(()=>{
                ServicePermission.bulkCreate(serviePermissions, { returning: true, ignoreDuplicates: false }).then((users)=>{
                    callback(null, userId);
                })
            });

        })
       
    }   

    function profilePermissionSeerer(userId, callback) {
        Promise.all([
            Permission.findOne({ where: { name: 'System Admin Permission'}}),
            Permission.findOne({ where: { name: 'Customer Permision'}}),
            Permission.findOne({ where: { name: 'Vendor Permission'}}),

            Profile.findOne({ where: { name: 'System Admin'}}),
        ]).then((values) => {
            const [ 
                systemAdminPermission, 
                customerPermission, 
                vendorPermission, 
                systemAdminProfile 
            ] = values;

            const profilePermissions = [
                {
                    profile_id: systemAdminProfile.id, 
                    permission_id: systemAdminPermission.id
                },
                {
                    profile_id: systemAdminProfile.id, 
                    permission_id: customerPermission.id
                },
                {
                    profile_id: systemAdminProfile.id, 
                    permission_id: vendorPermission.id
                },
            ];

            ProfilePermission.destroy({ truncate: { cascade: true } })
            .then(()=>{
                ProfilePermission.bulkCreate(profilePermissions, { returning: true, ignoreDuplicates: false }).then(()=>{
                    callback(null, userId);
                })
            });

        })
       
    }   

    async.waterfall(
        [
            userSeeder, 
            profileSeeder,
            userUpdateSeeder,
            serviceSeeder, 
            permissionSeeder, 
            servicePermissionSeerer, 
            profilePermissionSeerer
        ], 
        (err)=>{
            if(err) console.error(err);
            else console.log("DB seed copleted!");
            process.exit();
        }
    );
}

init();