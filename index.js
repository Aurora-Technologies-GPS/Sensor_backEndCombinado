const Net = require('net');

const { smart_adder } = require('./smartcitizen.js');

const { insert } = require('./Database/conector.js') //insert consult
const { utc_iso }=require('./tools.js')
const port = 3000;
const server = new Net.Server();

server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});

server.on('connection', (socket) => {
    console.log('established.'); //A new connection has been established.

    let date = new Date().toUTCString();
    socket.write(`HTTP/1.1 200 OK
        Date: ${date} 
        Content-Type: application/json; charset=UTF-8`);

    socket.on('data', (chunk) => {
        const dataIn = chunk.toString();
        let dato = { 
            sensor_name: "invalid_data_sensor", 
            sensor_type: "CESVA", 
            noise: null, 
            timestamp: "2023-12-09T00:00:00.000Z" 
        }

          try {
            const headjson = JSON.parse(dataIn.substring(dataIn.indexOf(`{"sensors"`), dataIn.length))
            let dataSensor = { value: 0, timestamp: new Date().toISOString() }

            try {
                dataSensor.value = headjson.sensors[0].observations[0].value
                dataSensor.timestamp = new Date(utc_iso(headjson.sensors[0].observations[0].timestamp)).toISOString();

            } catch (error) {
                console.log(error)
            }
            dato = {
                sensor_name: headjson.sensors[0].sensor,
                sensor_type: "CESVA",
                noise: dataSensor.value,
                timestamp: dataSensor.timestamp
            }
            try {
                insert(dato).then(resInsertion => {
                    // console.log(resInsertion)
                    console.log(" ")
                    console.log("CESVA Sensor Data Added to Database")
                    console.log(dataSensor)
                })
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            // console.log(error)
            console.log(" ")
            console.log("*********invalid Format JSON.parse************")
            console.log(dataIn)
            console.log("**********************************************")
        }

    });

    socket.on('end', function() {
        console.log('Closing connection'); //Closing connection with the client
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
