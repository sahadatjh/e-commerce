const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

function dashboard(req, res) {
    res.status(200).send("Welcome to our dashboar!");
}

function createUser(req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    if(findUser(email)) return res.status(400).send("User already exists!");

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

function findUser(email) {  
    const user = users.find(user => user.email === email);
    return user;
}

function login(req, res) {  
    const { email, password } = req.body;

    const user = findUser(email);
    if(!user) return res.status(400).send("Invaid credentials!");

    const matchedPass = bcrypt.compareSync(password, user.password);
    if(!matchedPass) return res.status(400).send("Invalid credentials!");

    const token = jwt.sign({
        firstName :user.firstName,
        lastName  : user.lastName,
        email     :user.email
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn: '1h',
        issuer:user.email,
    });
    console.log(token);

    res.cookie('access_token', token, {httpOnley: true });
    res.status(200).send(user);
}

module.exports.dashboard = dashboard;
module.exports.createUser = createUser;
module.exports.findUser = findUser;
module.exports.login = login;