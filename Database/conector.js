const mongoose = require('mongoose');

const username = 'username'
const password = 'password'

const uri = `mongodb://${username}:${password}@127.0.0.1:27017/edelivery_sensors`

const collectionName = mongoose.model("all_sensors", {  sensor_name: String, sensor_type:String, noise: Array, timestamp:Date});

//sensor: headjson.sensors[0].sensor, noise: headjson.sensors[0].observations
mongoose.connect(uri).then(() => {
    console.log("Base de Datos Conect")
}).catch(e => console.log(e))


async function consult() {
    try {
        const salidaDB = await collectionName.find()
        return salidaDB
    } catch (err) {
        return err
    }
}

async function insert(dato) {
    try {
        const insertValores = new collectionName(dato);
        const salidaDB = await insertValores.save()

        return salidaDB

    } catch (error) {
    	mongoose.connect(uri).then(() => {
    		console.log("Base de Datos ReConect")
    	}).catch(e => console.log(e))

        return error
    }
}
module.exports = { insert }
