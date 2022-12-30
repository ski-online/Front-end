const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const app = express()
const routes = require('./routes/router')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
app.use(express.json())

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