const { dashboard, createUser, login } = require( "./user.controller" );
const { createUserSchema, userLoginSchema } = require( "./user.schema");
const validate = require( "../core/middlewares/validate" );

module.exports = (app) => {
    app.get('/', dashboard);

    app.route('/users')
        .post(validate(createUserSchema), createUser)
        
    app.route('/users/login')
            .post(validate(userLoginSchema), login);
}