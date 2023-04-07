const path = require('path');

async function init() {  
    const config = require('./src/config');
    config.initEnvironmentVariables();

    const sequelize = require('./src/config/lib/sequelize');

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);

    require('./src/modules/user/user.model');
    const Service =  require('./src/modules/service/service.model');
    require('./src/modules/permission/permission.model');
    require('./src/modules/permission/service-permission.model');
    require('./src/modules/profile/profile.model');
    await sequelize.sync();

    console.log("DB seed copleted!");
}

init();