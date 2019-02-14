'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var md_auth = require('../middlewares/authenticated');

//Rutas
var api = express.Router();
api.get('/ejemplo', md_auth.ensureAuth, UserController.ejemplo);
api.post('/registrar', UserController.registrar);
api.post('/login', UserController.login);
api.put('/editar-usuario/:id', md_auth.ensureAuth, UserController.editarUsuario)


module.exports = api;