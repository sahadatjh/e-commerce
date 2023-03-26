const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {  
    let token = null;

    if(req && req.signedCookies){
        token = req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).send("Authentication failed!");
    }
    console.log('token \n-----------\n', token);
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded){
        if(err){
            console.log(err);
            return res.status(401).send('Invalid token')
        }
        console.log('decoded User \n--------------\n', decoded);
        req.user = decoded;
        next();
    });
}

module.exports = authenticate;