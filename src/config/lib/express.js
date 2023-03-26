const express = require('express');
const userRoutes = require( '../../modules/user/user.routes' );
const cookieParser = require("cookie-parser");
const userStrategy = require( '../../modules/user/user.strategy' );

module.exports = function () { 
    const app = express();

    app.use(express.json());
    app.use(cookieParser(process.env.COOKIE_SECRET));

    userRoutes(app);
    userStrategy();

    app.set('port', process.env.PORT);

    return app;
}