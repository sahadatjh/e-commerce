const { object, string } = require( "yup" );

const createServiceSchema = object().shape({
    name: string().required().min(2).max(100),
    description: string().max(250)
})

module.exports.createServiceSchema = createServiceSchema;