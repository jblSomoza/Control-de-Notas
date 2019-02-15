'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Company = require('../models/company');
var jwt = require('../services/jwt');

function ejemplo(req, res) {
    res.status(200).send({
        message: 'Hola'
    });
}

function registrar(req, res){
    var user = new User();
    var params = req.body;

    if(params.usuario && params.email && params.password){
        user.nombre = params.nombre;
        user.usuario = params.usuario;
        user.email = params.email;
        user.password = params.password;
        user.rol = params.rol;

        User.find({ $or:[
            {email: user.email.toLowerCase()},
            {email: user.email.toUpperCase()},
            {usuario: user.usuario.toLowerCase()},
            {usuario: user.usuario.toUpperCase()}
        ]}).exec((err, users) =>{
            if(err)return res.status(500).send({message: 'Error en la peticion de usuario'})

            if(users && users.length >= 1){
                return res.status(500).send({message: 'El usuario ya existe en el sistema'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err)return res.status(500).send({message: 'Error al guardar el usuario'});

                        if(usuarioGuardado){
                            res.status(200).send({user: usuarioGuardado});
                        }else{
                            res.status(404).send({message: 'no se a podido registar al usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los campos necesarios'
        });
    }
}

function login(req, res) {
    var params = req.body;
    var email2 = params.email;
    var password = params.password;

    User.findOne({email: email2}, (err, user)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})

        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    if(params.getToken){
                            return res.status(200).send({
                                token: jwt.createToken(user),
                            })                              
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                    }
                } else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'})
                }
            })
        } else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'})
        }
    })

}

function editarUsuario(req, res){
    var userId = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'no tiene los permisos para actualizar los datos de este usuario'})
    }
    User.findByIdAndUpdate(userId, params, {new:true}, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion'})

        if(!usuarioActualizado) return res.status(404).send({message: 'No se ha podido actualziar los datos del usuario'})
        
        return res.status(200).send({user: usuarioActualizado})
    })
}

function crearEmpresa(req, res) {
    var company = new Company();
    var params = req.body;

    if(req.user.rol == 'Administrador')
    {        
        
        if(params.nombre && params.contacto && params.telefono){
            company.nombre = params.nombre;
            company.contacto = params.contacto;
            company.telefono = params.telefono;
            company.direccion = params.direccion;
    
            User.find({ $or:[
                {nombre: company.nombre.toLowerCase()},
                {nombre: company.nombre.toUpperCase()},
                {direccion: company.direccion.toLowerCase()},
                {direccion: company.direccion.toUpperCase()}
            ]}).exec((err, company2) =>{
                if(err)return res.status(500).send({message: 'Error en la peticion de usuario'})
    
                if(company2 && company2.length >= 1){
                    return res.status(500).send({message: 'El usuario ya existe en el sistema'})
                }else{
                    company.save((err, empresaGuardada)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar la empresa'});
    
                        if(empresaGuardada){
                            res.status(200).send({company: empresaGuardada});
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
    }else{
        res.status(404).send({message: 'Usted no es administrador'});
    }
}

function modificarEmpresa(req, res) {
    var empresaId = req.params.empresaId;
    var update = req.params.body;

    Company.findOneAndUpdate(empresaId, update, (err, empresaActualizada)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})

        if(!empresaActualizada) return res.status(404).send({message: 'No se a podido actualizar'});

        res.status(200).send({ company: empresaActualizada});
    })
}

function borrarEmpresa(req, res) {

    if(req.user.rol == 'Administrador')
    {  
        var empresaId = req.params.empresaId;

        Company.findOneAndDelete(empresaId, (err, empresaBorrada) =>{
            if(err) return res.status(500).send({message: 'Error en la peticion'})

            if(!empresaBorrada) return res.status(404).send({message: 'No se a podido borrar'});

            if(err) return next(err);

            res.status(200).send({message: 'Se logro eliminar la empresa correctamente'});
        })
    }else{
        res.status(404).send({message: 'Usted es administrador'});
    }
}

module.exports = {
    ejemplo,
    registrar,
    login,
    editarUsuario,
    crearEmpresa,
    modificarEmpresa,
    borrarEmpresa
}