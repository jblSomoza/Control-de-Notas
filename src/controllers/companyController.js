'use strict'

var Alumno = require('../models/company');

function crearEmpresa(req, res) {
    var companie = new Companies();
    var params = req.body;

    if(params.nombre && params.contacto && params.telefono){
        companie.nombre = params.nombre;
        companie.contacto = params.contacto;
        companie.telefono = params.telefono;
        companie.direccion = params.direccion;

        User.find({ $or:[
            {nombre: companie.nombre.toLowerCase()},
            {nombre: companie.nombre.toUpperCase()},
            {direccion: companie.direccion.toLowerCase()},
            {direccion: companie.direccion.toUpperCase()}
        ]}).exec((err, companies) =>{
            if(err)return res.status(500).send({message: 'Error en la peticion de usuario'})

            if(companies && companies.length >= 1){
                return res.status(500).send({message: 'El usuario ya existe en el sistema'})
            }else{
                companie.save((err, empresaGuardada)=>{
                    if(err) return res.status(500).send({message: 'Error al guardar la empresa'});

                    if(empresaGuardada){
                        res.status(200).send({companie: empresaGuardada});
                    }else{
                        res.status(404).send({message: 'No se a podido registrar la empresa'});
                    }
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los campos necesarios'
        });
    }
}

module.exports = {
    crearEmpresa
}