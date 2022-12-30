const Impianto = require('../models/impianto')

const getAllImpianti = (req, res) => {
    Impianto.find({}, (err, data) => {
        if(err){
            return res.status(500).json({Error: err})
        }
        return res.json(data)
    })
}

const creaImpianto = (req, res) => {
    if(!(req.body.nome && req.body.portataOraria)){
        return res.status(400).json({message: 'dati inseriti nel formato sbagliato'})
    }
    const newImpianto = new Impianto({
        nome: req.body.nome,
        portataOraria: req.body.portataOraria
    })
    newImpianto.save((err, data) => {
        if(err){
            return res.status(500).json({Error: err})
        }
        return res.status(201).json(data)
    })
}

const modificaStatoImpianto = (req, res) => {
    if(req.headers.livello != 'Operatore' && req.headers.livello != 'Gestore'){
        return res.status(401).json({Error: "Azione non permessa ad un utente di livello " + req.headers.livello})
    }
    Impianto.findById(req.params.id, (err, data) => {
        if(!data){
            return res.status(404).json({message: "Impianto non trovato"})
        }
        Impianto.updateOne({_id: req.params.id}, {statoApertura: !data.statoApertura}, (err, data) => {
            if(err)
                return res.status(500).json({Error: err})
            return res.status(204)
        })
    })
}

module.exports = {getAllImpianti, creaImpianto, modificaStatoImpianto}