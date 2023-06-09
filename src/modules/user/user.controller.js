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

async function getUserByEmail(email) { 
    try {
        const user = await User.findOne({
            where: { email }
        })
        
        return user;
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function login(req, res) {  
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            // attributes: { exclude: ['password']}
        });

        if(!user || !user.password || !user.validPassword(password)) return res.status(400).send("Invaid credentials!");

        const token = jwt.sign({
            firstName : user.firstName,
            lastName  : user.lastName,
            email     : user.email,
            id        : user.id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1h',
            // issuer: user.email,
        });

        res.cookie('access_token', token, { httpOnly: true });
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function logout(req, res) {  
    res.clearCookie('access_token');

    res.status(200).send("Logout seccessfully!");
}

async function updateUser(req, res) {
    try {
        const { firstName, lastName } = req.body;
        const { email } = req.user;

        const user = await User.findOne({
            where: { email },
        });

        if(!user) return res.status(404).send("User not found!");

        await User.update({
            firstName, 
            lastName
        },
        {
            where: { email }
        });

        const updateUser =  await User.findOne({
            where: { email },
        });

        res.status(200).send(updateUser);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function deleteUser(req, res) {  
    try {
        console.log('delete method!');
        const user = await User.findOne({ where: { id: req.params.id } });

        if(!user) return res.status(404).send("User not found!");

        await user.destroy();

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

module.exports.dashboard = dashboard;
module.exports.getUsers = getUsers;
module.exports.createUser = createUser;
module.exports.getUserByID = getUserByID;
module.exports.login = login;
module.exports.logout = logout;
module.exports.updateUser = updateUser;
module.exports.getUserByEmail = getUserByEmail;
module.exports.deleteUser = deleteUser;