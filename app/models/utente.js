const mongoose = require('mongoose')

const schemaUtente = new mongoose.Schema({
    nome: {type:String, required:true}, 
    cognome: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    livelloUtente: {type:String, enum: ['Base', 'Operatore', 'Gestore'], default: 'Base'},
    nickname: String
})

const Utente = mongoose.model('Utente', schemaUtente)
module.exports = Utente