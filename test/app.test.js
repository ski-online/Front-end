const request = require('supertest');
const app = require("../app/app");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe("API test", () => {

    var token = jwt.sign( {email: 'John@mail.com'}, process.env.TOKEN_KEY, {expiresIn: 86400} );
    jest.setTimeout(8000);


    test('test API GET /utente esistente', async() => {
        const response = await request(app).get("/utente/mariorossi@gmail.com");
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toBe(200);
    });
    test('test API GET /utente non esistente', async() => {
        const response = await request(app).get("/utente/giuseppino@gmail.com");
        expect(response.body.message).toEqual("Utente non trovato");
        expect(response.statusCode).toBe(404);
    });
    test('test API POST /utente vuoto', async() => {
        const response = await request(app).post("/utente");
        expect(response.body.Error).toEqual("dati inseriti nel formato sbagliato");
        expect(response.statusCode).toBe(400);
    });
    test('test API POST /utente già esistente', async() => {
        const response = await request(app).post("/utente")
        .send({nome: "provaNome",
            cognome: "provaCognome",
            email: "mariorossi@gmail.com",
            password: "123456",
            nickname: "Marietto"})
        expect(response.body.Error).toEqual("Indirizzo email già utilizzato da un utente");
        expect(response.statusCode).toBe(409);
    });
    test('test API POST /utente corretta', async() => {
        const response = await request(app).post("/utente")
        .send({nome: "provaNome",
            cognome: "provaCognome",
            email: "prova@gmail.com",
            password: "123456",
            nickname: "Provetta"})
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toBe(201);
    });
    test('test API PUT /utente non trovato', async() => {
        const response = await request(app).put("/utente")
        .send({email: "prova1@gmail.com",
            oldPassword: "123456",
            newPassword: "654321"})
        .set('token', token).set('livello', 'Base')
        expect(response.body.Error).toEqual("Utente non trovato");
        expect(response.statusCode).toBe(404);
    });
    test('test API PUT /utente vecchia password errata', async() => {
        const response = await request(app).put("/utente")
        .send({email: "prova@gmail.com",
            oldPassword: "abcdef",
            newPassword: "654321"})
        .set('token', token).set('livello', 'Base')
        expect(response.body.Error).toEqual("Password errata");
        expect(response.statusCode).toBe(401);
    });
    test('test API PUT /utente formato sbagliato', async() => {
        const response = await request(app).put("/utente")
        .send({email: "prova@gmail.com"})
        .set('token', token).set('livello', 'Base')
        expect(response.body.Error).toEqual("dati inseriti nel formato sbagliato");
        expect(response.statusCode).toBe(400);
    });
    test('test API PUT /utente corretta', async() => {
        const response = await request(app).put("/utente")
        .send({email: "prova@gmail.com",
            oldPassword: "123456",
            newPassword: "654321"})
        .set('token', token).set('livello', 'Base')
        expect(response.statusCode).toBe(204);
    });
    test('test API POST /login formato errato', async() => {
        const response = await request(app).post("/login")
        .send({email: "prova@gmail.com"})
        expect(response.body.Error).toEqual("dati inseriti nel formato sbagliato");
        expect(response.statusCode).toBe(400);
    });
    test('test API POST /login corretta', async() => {
        const response = await request(app).post("/login")
        .send({email: "prova@gmail.com", password: "654321"})
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toBe(200);
    });
    test('test API POST /login non esistente', async() => {
        const response = await request(app).post("/login")
        .send({email: "prova123@gmail.com", password: "654321"})
        expect(response.body.Error).toEqual("Utente non trovato");
        expect(response.statusCode).toBe(404);
    });
    test('test API POST /login password errata', async() => {
        const response = await request(app).post("/login")
        .send({email: "prova@gmail.com", password: "123456"})
        expect(response.body.Error).toEqual("Password errata");
        expect(response.statusCode).toBe(401);
    });
    test('test API DELETE /utente token non presente', async() => {
        const response = await request(app).delete("/utente/prova@gmail.com")
        expect(response.body.Error).toEqual("Token o livello non presenti");
        expect(response.statusCode).toBe(401);
    });
    test('test API DELETE /utente token non valido', async() => {
        const response = await request(app).delete("/utente/prova@gmail.com")
        .set('token', "123").set('livello', 'Operatore')
        expect(response.body.Error).toEqual("Token fornito non valido");
        expect(response.statusCode).toBe(401);
    });
    test('test API DELETE /utente non permessa', async() => {
        const response = await request(app).delete("/utente/prova@gmail.com")
        .set('token', token).set('livello', 'Operatore')
        expect(response.body.Error).toEqual("Azione non permessa ad un Utente di livello Operatore");
        expect(response.statusCode).toBe(401);
    });
    test('test API DELETE /utente corretta', async() => {
        const response = await request(app).delete("/utente/prova@gmail.com")
        .set('token', token).set('livello', 'Base')
        expect(response.body.message).toEqual("Utente eliminato correttamente");
        expect(response.statusCode).toBe(200);
    });
    test('test API POST /log formato sbagliato', async() => {
        const response = await request(app).post("/log")
        .send({idImpianto: "63a4de9eec8ee30dee706855"})
        .set('token', token).set('livello', 'Base')
        expect(response.body.Error).toEqual("dati inseriti nel formato sbagliato");
        expect(response.statusCode).toBe(400);
    });
    test('test API POST /log corretta', async() => {
        const response = await request(app).post("/log")
        .send({idImpianto: "63a4de9eec8ee30dee706855", idUtente: "639c64292f351b13f99e0137"})
        .set('token', token).set('livello', 'Base')
        expect(response.body).toEqual(expect.any(Object));
        expect(response.statusCode).toBe(200);
    });
    test('test API GET /log ', async() => {
        const response = await request(app).get("/log/639c64292f351b13f99e0137")
        .set('token', token).set('livello', 'Base')
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toBe(200);
    });
    test('test API GET /affollamento ', async() => {
        const response = await request(app).get("/affollamento");
        expect(response.body.num).toBe(1);
        expect(response.statusCode).toBe(200);
    });
    test('test API GET /affollamentoSingolo ', async() => {
        const response = await request(app).get("/affollamentoSingolo");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toBe(200);
    });
    test('test API GET /impianto ', async() => {
        const response = await request(app).get("/impianto");
        expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
        expect(response.statusCode).toBe(200);
    });
    test('test API PUT /impianto non permessa', async() => {
        const response = await request(app).put("/impianto/63aed003fd4ec232157d5c07")
        .set('token', token).set('livello', 'Base')
        expect(response.body.Error).toEqual("Azione non permessa ad un utente di livello Base");
        expect(response.statusCode).toBe(401);
    });
    test('test API PUT /impianto non esistente', async() => {
        const response = await request(app).put("/impianto/1234")
        .set('token', token).set('livello', 'Operatore')
        expect(response.body.message).toEqual("Impianto non trovato");
        expect(response.statusCode).toBe(404);
    });
    test('test API PUT /impianto corretta', async() => {
        const response = await request(app).put("/impianto/63a4de9eec8ee30dee706855")
        .set('token', token).set('livello', 'Operatore')
        expect(response.statusCode).toBe(204);
    });
});