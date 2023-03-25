const { object, string, ref } = require('yup');

const createUserSchema = object().shape({
    firstName       : string().required().min(2).max(32),
    lastName        : string().required().min(2).max(32),
    email           : string().email().required().max(64),
    password        : string().required().min(8).max(64),
    confirmPassword : string().required().oneOf([ref('password'), null], 'password and confirm password must be matched!')
})

module.exports.createUserSchema = createUserSchema;