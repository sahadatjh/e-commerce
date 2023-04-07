const AuthStrategy = require( "../user/user-authentication.middleware" );
const { getProfiles, createProfile, getProfileById, updateProfile, deleteProfile } = require( "./profile.controller" );
const { profileSchema } = require( "./profile.schema" );
const validate = require('../core/middlewares/validate');


module.exports = (app) => {
    app.route('/profiles')
        .get(AuthStrategy, getProfiles)
        .post(AuthStrategy, validate(profileSchema), createProfile);

    app.route('/profiles/:id')
        .get(AuthStrategy, getProfileById)
        .patch(AuthStrategy, validate(profileSchema), updateProfile)
        .delete(AuthStrategy, deleteProfile);
}