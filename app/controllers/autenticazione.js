const Utente = require('../models/utente')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const login = (req, res) => {
    if(!(req.body.email && req.body.password)){
        return res.status(400).json({Error: 'dati inseriti nel formato sbagliato'})
    }
    Utente.findOne({email: req.body.email}, (err, data) => {
        if(!data){
            return res.status(404).json({Error: "Utente non trovato"})
        }else if(err){
            return res.status(500).json({Error: err})
        }else{
            bcrypt.compare(req.body.password, data.password, (err, result) => {
                if(err){
                    return res.status(500).json({Error: err})
                }else if(result){
                    let token = jwt.sign({email: data.email, id: data._id}, process.env.TOKEN_KEY, {expiresIn: 86400}/* one day*/)
                    return res.json({nome: data.nome, cognome: data.cognome, email: data.email, livelloUtente: data.livelloUtente, token: token})
                }else{
                    return res.status(401).json({Error: "Password errata"})
                }
            })
        }
    })
}

const tokenCheck = (req, res, next) => {
    if(!(req.headers.token && req.headers.livello)){
        return res.status(401).json({Error: 'Token o livello non presenti'})
    }
    jwt.verify(req.headers.token, process.env.TOKEN_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({Error: "Token fornito non valido"})
        }
        next()
    })
}

module.exports = {login, tokenCheck}