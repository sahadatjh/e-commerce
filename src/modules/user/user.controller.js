const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

const users = [];

function dashboard(req, res) {
    res.status(200).send("Welcome to our dashboar!");
}

async function getUsers(req, res){
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password']}
            // attributes: ['id','firstName', 'lastName'] //code for specific field
        });

        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function createUser(req, res) {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        
        const userExists = await User.findOne({
            where: { email }
        });

        if (userExists) return res.status(400).send("User already registered!");

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!")
    }
}

async function getUserByID(req, res) { 
    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: { id },
            attributes: { 
                exclude : ['password']
            }
        }) 

        if(!user) return res.status(404).send("User not found!");

        res.status(200).send(user);       
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

function login(req, res) {  
    const { email, password } = req.body;

    const user = getUserByID(email);
    if(!user) return res.status(400).send("Invaid credentials!");

    const matchedPass = bcrypt.compareSync(password, user.password);
    if(!matchedPass) return res.status(400).send("Invalid credentials!");

    const token = jwt.sign({
        firstName : user.firstName,
        lastName  : user.lastName,
        email     : user.email
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn: '1h',
        issuer: user.email,
    });

    res.cookie('access_token', token, { httpOnley: true });
    res.status(200).send(user);
}

function updateUser(req, res) {
    const { firstName, lastName } = req.body;
    const { email } = req.user;
    console.log('User update method \n----------------\n', req.user);
    const user = getUserByID(email);
    if(!user) return res.status(404).send("User not found!");

    user.firstName = firstName;
    user.lastName = lastName;

    res.status(200).send(user);
}

module.exports.dashboard = dashboard;
module.exports.getUsers = getUsers;
module.exports.createUser = createUser;
module.exports.getUserByID = getUserByID;
module.exports.login = login;
module.exports.updateUser = updateUser;