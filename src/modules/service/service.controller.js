const Service = require('./service.model');

async function createService(req, res){
    try {
        const { name, description, created_by, updated_by } = req.body;

        const isExists = await Service.findOne({
            where: { name }
        });

        if(isExists) return res.status(400).send("Service already exists!");

        const service = await Service.create({
            name,
            description, 
            created_by,
            updated_by
        })

        res.status(200).send(service);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

async function getServices(req, res) {  
    try {
        const services = await Service.findAll();
        res.status(200).send(services);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

async function getSeviceById(req, res) {  
    const { id } = req.params;

    const service =await Service.findOne({
        where:{ id }
    })

    if(!service) return res.status(404).send("Service not found!");

    res.status(200).send(service);
}

module.exports.createService = createService;
module.exports.getServices = getServices;
module.exports.getSeviceById = getSeviceById;