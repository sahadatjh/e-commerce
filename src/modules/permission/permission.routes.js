const AuthStrategy = require( "../user/user-authentication.middleware" );
const { getPermissions, createPermission, getPrmissionById, updatePermission, deletePermission } = require( "./permission.controller" );
const { permissionSchema } = require( "./permission.schema" );
const validate = require('../core/middlewares/validate');


module.exports = (app) => {
    app.route('/permissions')
        .get(AuthStrategy, getPermissions)
        .post(AuthStrategy, validate(permissionSchema), createPermission);

    app.route('/permissions/:id')
        .get(AuthStrategy, getPrmissionById)
        .patch(AuthStrategy, validate(permissionSchema), updatePermission)
        .delete(AuthStrategy, deletePermission);
}