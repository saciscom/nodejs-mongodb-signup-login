const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const errorController = require('./controllers/error');

const MONGODB_URI = require('./config').MONGODB_URI

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.use(errorController.error500);

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('connect success');
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })