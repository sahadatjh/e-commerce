const Profile = require('./profile.model');

async function createProfile(req, res){
    try {
        const { name, description } = req.body;
        const created_by = updated_by = updated_by = req.user.id

        const isExists = await Profile.findOne({ where: { name } });

        if(isExists) return res.status(400).send("Profile already exists!");

        const profile = await Profile.create({
            name,
            description,
            created_by,
            updated_by
        })

        res.status(200).send(profile);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

async function getProfiles(req, res) {  
    try {
        const profiles = await Profile.findAll();
        res.status(200).send(profiles);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

async function getProfileById(req, res) {  
    const profile = await Profile.findOne({ where:{ id: req.params.id } });

    if(!profile) return res.status(404).send("Profile not found!");

    res.status(200).send(profile);
}

async function updateProfile(req, res){
    const { name, description } = req.body;
    const updated_by = req.user.id;
    const profile_id = req.params.id;

    const profile = await Profile.findOne({ where: { id: profile_id } });

    if(!profile) return res.status(404).send("Profile not found!");

    await profile.update({ name, description, updated_by });

    const updatedProfile = await Profile.findOne({ id: profile_id });
    
    res.status(200).send(updatedProfile);
}

async function deleteProfile(req, res){
    try {
        const profile = await Profile.findOne({ where: { id: req.params.id } });

        if(!profile) return res.status(404).send("Profile not found!");

        await profile.destroy();

        res.status(200).send(profile);
    } catch (err) { 
        console.log(err);
        res.status(500).send("Internal server error!")
    }
}
module.exports.createProfile = createProfile;
module.exports.getProfiles = getProfiles;
module.exports.getProfileById = getProfileById;
module.exports.updateProfile = updateProfile;
module.exports.deleteProfile = deleteProfile;