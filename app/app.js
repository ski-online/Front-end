const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const app = express()
const routes = require('./routes/router')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
app.use(express.json())

//enable cross-origin request
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "front-end-production-847c.up.railway.app"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/', routes)

app.use('/static', express.static('static'))


const listener = app.listen(process.env.PORT)

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);
module.exports = app