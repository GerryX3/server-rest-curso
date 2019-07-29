require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Colors = require('colors/safe');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, resp) => {
    if (err) {
        throw err;
    } else {
        console.log(Colors.green('Base de datos online'));
    }
});

app.listen(process.env.PORT, () => {
    console.log(Colors.magenta('Escuchando el puerto: '), Colors.yellow(process.env.PORT));
});