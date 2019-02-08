'use strict'    //Sirve para utilizar la ultima version de javascript

const mongoose = require("mongoose"); //extrae todos los recursos de mongoose
const app = require("./app");

mongoose.Promise = global.Promise;  //Crea una promesa
mongoose.connect('mongodb://localhost:27017/Kinal', {useNewUrlParser: true}).then(()=>{
    console.log('Se encuentra conectado a la base de datos');

    app.set('port', process.env.PORT || 3000);   //buscara un puerto automaticamente
    app.listen(app.get('port'), ()=>{
        console.log(`El servidor esta corriendo en el puerto: '${app.get('port')}'`);  //comillas invertidas dejan crear una variable dentro dle mensaje
    });
}).catch(err => console.log(err));
