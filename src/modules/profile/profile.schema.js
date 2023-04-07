const { object, string } = require( "yup" );

const profileSchema = object().shape({
    name: string().required().min(2).max(100),
})

module.exports.profileSchema = profileSchema;