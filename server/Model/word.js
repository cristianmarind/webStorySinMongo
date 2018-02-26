'use strict'

const mongoose= require('mongoose');
const Schema=mongoose.Schema

const wordShchema= Schema(
    {
     word:String
    }
);

// para exportar el modelo y que se pueda usar desde cualquier
// parte de la aplicación 

module.exports=mongoose.model('Word',wordShchema);

// para importarlo de hace lo siguiente

/*
 const Palabra= require('./models/Palabra');


*/