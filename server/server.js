const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config({path: './config.env'})
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(require('./routes/record'));
app.use(require('./routes/song'));
// if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})
// }

// Get a driver connection
const dbo = require('./db/conn');

app.listen(PORT, () => {
    // perform a database connection when server starts
    dbo.connectToServer(err => {
        if (err) console.log(err);
    });

    console.log('Server listening on port: ' + PORT);
})