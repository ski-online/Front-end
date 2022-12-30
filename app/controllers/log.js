const Log = require('../models/log')
const Impianto = require('../models/impianto')

const getAllLogsUtente = (req, res) => {
    Log.find({utente: req.params.idUtente}, (err, data) => {
        if(err){
            return res.status(500).json({Error: err})
        }
        return res.json(data)
    })
}

async function logNegliUltimi30Minuti(req, res){
    let impianti = await Impianto.find()
    let list = []
    for(const impianto of impianti){
        let val
        if(impianto.statoApertura){
            let result = await Log.find({impianto: impianto._id, timestamp: {$gte : (Date.now() - (30 * 60 * 1000))}}).count()
            val = result*100/impianto.portataOraria
        }else{
            val = -1
        }
        list.push({"impianto": impianto.nome, "perc": val})
    };
    res.json(list)
}

const utentiNellUltimaOra = (req, res) => {
    Log.distinct("utente", {timestamp: {$gte : (Date.now() - (60 * 60 * 1000))}},(err, data) => {
        if(err){
            return res.status(500).json({Error: err})
        }
        return res.json({"num": data.length})
    })
}

const createLog = (req, res) => {
    if(!(req.body.idImpianto && req.body.idUtente)){
        return res.status(400).json({Error: 'dati inseriti nel formato sbagliato'})
    }
    const newLog = new Log({
        impianto: req.body.idImpianto,
        utente: req.body.idUtente,
        timestamp: Date.now()
    })
    newLog.save((err, data) => {
        if(err)
            return res.status(500).json({Error: err})
        return res.json(data)
    })
}

module.exports = {getAllLogsUtente, utentiNellUltimaOra, logNegliUltimi30Minuti, createLog}