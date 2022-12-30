const express = require('express')
const router = express.Router()
const utenteController = require('../controllers/utente')
const autenticazioneController = require('../controllers/autenticazione')
const impiantoController = require('../controllers/impianto')
const logController = require('../controllers/log')

router.use('/', express.static('static'))

router.get('/utente/:email', utenteController.getUtente)
router.post('/utente', utenteController.nuovoUtente)

router.post('/login', autenticazioneController.login)

router.get('/impianto', impiantoController.getAllImpianti)
router.post('/impianto', impiantoController.creaImpianto) //DA RIMUOVERE

router.get('/affollamentoSingolo/', logController.logNegliUltimi30Minuti)
router.get('/affollamento', logController.utentiNellUltimaOra)

router.use(autenticazioneController.tokenCheck)

router.delete('/utente/:email', utenteController.rimuoviUtente)
router.put('/utente', utenteController.modificaPassword)

router.get('/log/:idUtente', logController.getAllLogsUtente)
router.post('/log', logController.createLog)

router.put('/impianto/:id', impiantoController.modificaStatoImpianto)

module.exports = router