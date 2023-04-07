const { object, string } = require( "yup" );

const permissionSchema = object().shape({
    name: string().required().min(2).max(100),
})

module.exports.permissionSchema = permissionSchema;