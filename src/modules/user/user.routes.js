const { dashboard, createUser, login, updateUser } = require( "./user.controller" );
const { createUserSchema, userLoginSchema, updateUserSchema } = require( "./user.schema");
const validate = require( "../core/middlewares/validate" );
const authenticate = require('../core/middlewares/authenticate');
const AuthStrategy = require( "./user-authentication.middleware" );

module.exports = (app) => {
    app.get('/', dashboard);

    app.route('/users')
        .post(validate(createUserSchema), createUser)
        .patch(AuthStrategy, validate(updateUserSchema), updateUser);
        
    app.route('/users/login')
            .post(validate(userLoginSchema), login);
}