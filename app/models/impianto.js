const mongoose = require('mongoose')

const schemaImpianto = new mongoose.Schema({
    nome: {type:String, required:true}, 
    portataOraria: {type:Number, required:true},
    statoApertura: {type:Boolean, default:false}
})

const Impianto = mongoose.model('Impianto', schemaImpianto)
module.exports = Impianto