const bcrypt = require('bcrypt');


const users = [];

function dashboard(req, res) {
    res.status(200).send("Welcome to our dashboar!");
}

function createUser(req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);    

    const newUser = {
        firstName,
        lastName,
        email,
        password: hashPassword
    }

    users.push(newUser);
    
    const modifyedUser = {...newUser};
    delete modifyedUser.password;

    res.status(200).send(modifyedUser);
}

module.exports.dashboard = dashboard;
module.exports.createUser = createUser;