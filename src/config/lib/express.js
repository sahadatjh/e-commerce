const express = require('express');
const userRoutes = require( '../../modules/user/user.routes' );
const cookieParser = require("cookie-parser");

module.exports = function () { 
    const app = express();

    app.use(express.json());
    app.use(cookieParser(process.env.COOKIE_SECRET));

    userRoutes(app);

    app.set('port', process.env.PORT);

    return app;
}