const AuthStrategy = require( "../user/user-authentication.middleware" );
const { getServices, createService, getSeviceById, updateService, deleteService } = require( "./service.controller" );
const { serviceSchema } = require( "./service.schema" );
const validate = require('../core/middlewares/validate');


module.exports = (app) => {
    app.route('/services')
        .get(AuthStrategy, getServices)
        .post(AuthStrategy, validate(serviceSchema), createService);

    app.route('/services/:id')
        .get(AuthStrategy, getSeviceById)
        .patch(AuthStrategy, validate(serviceSchema), updateService)
        .delete(AuthStrategy, deleteService);
}