const AuthStrategy = require( "../user/user-authentication.middleware" );
const { getServices, createService, getSeviceById } = require( "./service.controller" );
const { createServiceSchema } = require( "./service.schema" );
const validate = require('../core/middlewares/validate');


module.exports = (app) => {
    app.route('/services')
        .get(AuthStrategy, getServices)
        .post(AuthStrategy, validate(createServiceSchema), createService);

    app.get('/services/:id', AuthStrategy, getSeviceById);
}