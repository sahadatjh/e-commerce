const { dashboard } = require( "./user.controller" )

module.exports = (app) => {
    app.get('/', dashboard);
}