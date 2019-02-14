'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var md_auth = require('../middlewares/authenticated');

//Rutas
var api = express.Router();
api.get('/ejemplo', md_auth.ensureAuth, UserController.ejemplo);

api.post('/registrar', UserController.registrar);
api.post('/login', UserController.login);
api.post('/crearEmpresa', md_auth.ensureAuth, UserController.crearEmpresa);

api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario)
api.put('/modificarEmpresa/:id', md_auth.ensureAuth, UserController.modificarEmpresa);

api.delete('/borrarEmpresa/:id', md_auth.ensureAuth, UserController.borrarEmpresa);



module.exports = api;