 const {  insert } = require('./Database/conector.js')

 const axios = require('./node_modules/axios/dist/node/axios.cjs');
 let ids

 axios.get('https://api.smartcitizen.me/v0/me?access_token=JYtye5gdrsKFSSqGMenbv7JIJtWEuZkA1ucC0kXM8sA').then(response => {
     ids = []
     if (response.data.devices) {
         response.data.devices.forEach(elem_id => {
             ids.push({
                 id: elem_id.id,
                 lastUpdate: ['hoy']
             })
             axios.get(`https://api.smartcitizen.me/v0/devices/${elem_id.id}`).then(resp_ids => {
                 let dato = {
                     sensor_name: resp_ids.data.name,
                     sensor_type: resp_ids.data.data.sensors[4].name,
                     noise: [(resp_ids.data.data.sensors[4].value).toString()],
                     timestamp: resp_ids.data.data.sensors[4].last_reading_at
                 }
                 try {
                     insert(dato).then(resInsertion => {
                         // console.log(resInsertion)
                         console.log(" ")
                         console.log("Smartcitizen Sensor Data Added to Database")
                         console.log(resp_ids.data.name)
                     })
                 } catch (error) {
                     console.log(error)
                 }
             })
         })
     }
 })
 
 const smart_adder = setInterval(() => {
     console.log(' ')
     try {
         ids.forEach((elem_id, index) => {
             axios.get(`https://api.smartcitizen.me/v0/devices/${elem_id.id}`).then(resp_ids => {

                 let dato = {
                     sensor_name: resp_ids.data.name,
                     sensor_type: resp_ids.data.data.sensors[4].name,
                     noise: [(resp_ids.data.data.sensors[4].value).toString()],
                     timestamp: resp_ids.data.data.sensors[4].last_reading_at
                 }
                 try {
                     if (elem_id.lastUpdate == dato.timestamp) {
                         console.log("---No Hay actualizaciones Nuevas---")
                     } else {
                         ids[index].lastUpdate = dato.timestamp
                         insert(dato).then(resInsertion => {
                             console.log({
                                 _: "Smartcitizen Sensor Data Added to Database"
                             })
                         })
                     }
                 } catch (error) {
                     console.log(error)
                 }
             })
         })
     }catch(err){
        console.log(err)
     }
 }, 60000)

 module.exports = {  smart_adder }