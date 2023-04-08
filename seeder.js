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
    
    await sequelize.sync();


    function userSeeder(callback) {
        User.findOrCreate({
            where: { email: 'superadmin@gmail.com' },
            defaults: { 
                firstName: "Super", 
                lastName: 'Admin', 
                password: 'secret123' 
            }
        }).then((users)=>{
            callback(null, users[0].id);
        })
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
                    callback(null, users[0].id);
                })
            });
    }
    
    function permissionSeeder(userId, callback) {
        const permissions = [{ 
            name: 'System Admin Permission', 
            description: 'This permission for manage seytem admin',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Vendor Permission', 
            description: 'This permission for manage vendors',
            created_by: userId,
            updated_by: userId
        },
        { 
            name: 'Customer Permision', 
            description: 'This permission for manage customers',
            created_by: userId,
            updated_by: userId
        }];

        Permission.destroy({ truncate: { cascade: true } })
            .then(()=>{
                Permission.bulkCreate(permissions, { returning: true, ignoreDuplicates: false }).then(()=>{
                    callback(null, users[0].id);
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
                ServicePermission.bulkCreate(serviePermissions, { returning: true, ignoreDuplicates: false }).then(()=>{
                    callback(null, users[0].id);
                })
            });

        })
       
    }

    async.waterfall([userSeeder, serviceSeeder, permissionSeeder, servicePermissionSeerer], (err)=>{
        if(err) console.error(err);
        else console.log("DB seed copleted!");
        process.exit();
    });
}

init();