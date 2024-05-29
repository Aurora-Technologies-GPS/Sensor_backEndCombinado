
const Net = require('net');

const port = 3000;
const host = 'localhost';

const client = new Net.Socket();

client.connect({ port: port, host: host }, () => {

    console.log('TCP connection established with the server');

    const mensaje=`
PUT / HTTP/1.1
Host: 10.0.0.28
IDENTITY_KEY: sentilojson
 Content-Type: application/json; charset=UTF-8
 Content-Length: 505 Connection: keep-alive


     {"sensors":[
         {
               "sensor":"Feak120-T256847-N",
                 "observations":[                         {"value":"53.4", "timestamp":"30/04/2024T17:44:04UTC"}
                 ]         },{                 "sensor":"TA120-T256847-O",
                 "observations":[
                         {"value":"false", "timestamp":"08/04/2024T17:44:04UTC"}
                 ]
         },{
                 "sensor":"TA120-T256847-U",
                 "observations":[
                         {"value":"false", "timestamp":"08/04/2024T17:44:04UTC"}
                 ]
         },{                 "sensor":"TA120-T256847-W",
                 "observations":[
                         {"value":"100", "timestamp":"08/04/2024T17:44:04UTC"}
                 ]
         }
 ]}
`

    client.write(mensaje);
});

client.on('data', (chunk)=> {
    console.log(`Data received from the server: ${chunk.toString()}`);

    // Request an end to the connection after the data has been received.
    client.end();
});

client.on('end', ()=> {
    console.log('Requested an end to the TCP connection');
});
