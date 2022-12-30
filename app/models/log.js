const mongoose = require('mongoose')

const schemaLog = new mongoose.Schema({
    impianto: {type:String, required:true},
    utente: {type:String, required:true},
    timestamp: {type:Number, required:true}
})

const Log = mongoose.model('Log', schemaLog)
module.exports = Log