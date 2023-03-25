const { dashboard, createUser } = require( "./user.controller" )

module.exports = (app) => {
    app.get('/', dashboard);

    app.route('/users')
        .post(createUser);
}