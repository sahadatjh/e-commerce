const { dashboard, createUser } = require( "./user.controller" );
const { createUserSchema } = require( "./user.schema");
const validate = require( "../core/middlewares/validate" );

module.exports = (app) => {
    app.get('/', dashboard);

    app.route('/users')
        .post(validate(createUserSchema), createUser);
}