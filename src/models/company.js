'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompaniesSchema = Schema({
    nombre: String, 
    contacto: String,
    telefono: String,
    direccion: String
});

module.exports = mongoose.model('Companies', CompaniesSchema); //Este nombre es de la base de datos

