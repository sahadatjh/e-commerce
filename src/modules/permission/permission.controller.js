const Service = require( '../service/service.model' );
const Permission = require('./permission.model');
const ServicePermission = require( './service-permission.model' );

async function createPermission(req, res){
    try {
        const { name } = req.body;
        const created_by = updated_by = updated_by = req.user.id

        const isExists = await Permission.findOne({ where: { name } });

        if(isExists) return res.status(400).send("Permission already exists!");

        const permission = await Permission.create({
            name,
            created_by,
            updated_by
        })

        res.status(200).send(permission);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

async function getPermissions(req, res) {  
    try {
        const permissions = await Permission.findAll({
            include:[{
                    model: ServicePermission,
                    as: 'servicePermissions',
                    include: [{
                        model: Service,
                        as: 'service'
                    }]
                }]

        });
        res.status(200).send(permissions);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

async function getPrmissionById(req, res) {  
    const permission = await Permission.findOne({ where:{ id: req.params.id } });

    if(!permission) return res.status(404).send("Permission not found!");

    res.status(200).send(permission);
}

async function updatePermission(req, res){
    const { name } = req.body;
    const updated_by = req.user.id;
    const permission_id = req.params.id;

    const permission = await Permission.findOne({ where: { id: permission_id } });

    if(!permission) return res.status(404).send("Permission not found!");

    await permission.update({ name, updated_by });

    const updatedPermission = await Permission.findOne({ id: permission_id });
    
    res.status(200).send(updatedPermission);
}

async function deletePermission(req, res){
    try {
        const permission = await Permission.findOne({ where: { id: req.params.id } });

        if(!permission) return res.status(404).send("Permission not found!");

        await permission.destroy();

        res.status(200).send(permission);
    } catch (err) { 
        console.log(err);
        res.status(500).send("Internal server error!")
    }
}
module.exports.createPermission = createPermission;
module.exports.getPermissions = getPermissions;
module.exports.getPrmissionById = getPrmissionById;
module.exports.updatePermission = updatePermission;
module.exports.deletePermission = deletePermission;