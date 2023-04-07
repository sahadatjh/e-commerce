const { dashboard, createUser, login, updateUser, getUsers, getUserByID, logout, deleteUser } = require( "./user.controller" );
const { createUserSchema, userLoginSchema, updateUserSchema } = require( "./user.schema");
const validate = require( "../core/middlewares/validate" );
const AuthStrategy = require( "./user-authentication.middleware" );

module.exports = (app) => {
    app.get('/', dashboard);

    app.route('/users')
        .get(AuthStrategy, getUsers)
        .post(validate(createUserSchema), createUser)
        .patch(AuthStrategy, validate(updateUserSchema), updateUser);
    
    app.route('/users/:id')
        .get(AuthStrategy, getUserByID)
        .delete(AuthStrategy, deleteUser);

    app.post('/login', validate(userLoginSchema), login);
    app.post('/logout', AuthStrategy, logout);
}