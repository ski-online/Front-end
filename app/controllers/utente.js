const Utente = require('../models/utente')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getUtente = (req, res) => {
    Utente.findOne({email: req.params.email}, (err, data) => {
        if(err){
            return res.status(500).json({Error: err})
        }else if(!data){
            return res.status(404).json({message: "Utente non trovato"})
        }
        return res.json(data)
    })
}

const nuovoUtente = (req, res) => {
    if(!(req.body.nome && req.body.cognome && req.body.email && req.body.password && req.body.nickname)){
        return res.status(400).json({Error: 'dati inseriti nel formato sbagliato'})
    }
    Utente.findOne({email: req.body.email}, (err, data) => {
        if(!data){  //se il dato non esiste ancora
            bcrypt.hash(req.body.password, 5, (err, hash) => {
                if(err)
                    return res.status(500).json({Error: err})
                const newUtente = new Utente({
                    nome: req.body.nome,
                    cognome: req.body.cognome,
                    email: req.body.email,
                    password: hash,
                    nickname: req.body.nickname
                })
                newUtente.save((err, data) =>{
                    if(err)
                        return res.status(500).json({Error: err})
                    return res.status(201).json(data)
                })
            })
        }else{
            if(err) 
                return res.status(500).json({Error:`Something went wrong, please try again. ${err}`})
            return res.status(409).json({Error: "Indirizzo email già utilizzato da un utente"})
        }
    })
}

const rimuoviUtente = (req, res) => {
    if(req.headers.livello != 'Base'){
        return res.status(401).json({Error: "Azione non permessa ad un Utente di livello " + req.headers.livello})
    }
    Utente.deleteOne({email: req.params.email}, (err, data) => {
        if(err){
            return res.status(500).json({Error: `Something went wrong, please try again. ${err}`})
        }
        return res.json({message: "Utente eliminato correttamente"})
    })
}

const modificaPassword = (req, res) => {
    if(!(req.body.email && req.body.oldPassword && req.body.newPassword)){
        return res.status(400).json({Error: 'dati inseriti nel formato sbagliato'})
    }
    Utente.findOne({email: req.body.email}, (err, data) => {
        if(!data){
            return res.status(404).json({Error: "Utente non trovato"})
        }else if(err){
            return res.status(500).json({Error: err})
        }else{
            bcrypt.compare(req.body.oldPassword, data.password, (err, result) => {
                if(err){
                    return res.json({Error: err})
                }else if(result){
                    //controllo token
                    bcrypt.hash(req.body.newPassword, 5, (err, hash) => {
                        if(err)
                            return res.status(500).json({Error: err})
                        Utente.updateOne({email: req.body.email}, {password: hash}, (err, update) => {
                            if(err)
                                return res.status(500).json({Error: err})
                            return res.status(204).json({})
                        })
                    })
                }else{
                    return res.status(401).json({Error: "Password errata"})
                }
            })
        }
    })
}

module.exports = {getUtente, nuovoUtente, rimuoviUtente, modificaPassword}