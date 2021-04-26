const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const errorController = require('./controllers/error');

const imageFile = require('./utils/file');
const MONGODB_URI = require('./config').MONGODB_URI
const PORT = require('./config').PORT

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(
    multer({storage: imageFile.imageFileStorage, fileFilter: imageFile.imageFileFilter}).fields([
        {name: 'avatar', maxCount: 1},
        {name: 'file', maxCount: 8}
    ])
);

app.use('/images', express.static(path.join(__dirname, 'images')));

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
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    })