const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const busboy = require('connect-busboy');
const app = express();
require('dotenv').config({path: './config.env'})
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: '*',
    // optionsSuccessStatus: 200 
  }));

// To parse FormData
app.use(fileUpload());
// To parse application/json
app.use(busboy());
app.use(express.json());
// To parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes/record'));
app.use(require('./routes/song'));
app.use(require('./routes/uploadfile'));
app.use(require('./routes/deletesong'));
app.use(require('./routes/auth.routes'));
app.use(require('./routes/test.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    app.get(['/', '/playlists', '/liked'], (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'));
    })
}

// Get a driver connection
const dbo = require('./db/conn');
const db = require('./db/db');
const Role = db.Role;

const initialDb = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save(err => console.log(err));
            new Role({
                name: 'admin'
            }).save(err => console.log(err));
            new Role({
                name: 'moderator'
            }).save(err => console.log(err));
            console.log('Added user, admin and moderator roles');
        }
    });
}

app.listen(PORT, () => {
    // perform a database connection when server starts
    dbo.connectToServer(err => {
        if (err) console.log(err);
    });
    db.mongoose
        .connect(db.config.HOST + '/' + db.config.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Succesfully connected to db');
            initialDb();
        })
        .catch(err => {
            console.log('Mongoose connection error: ' + err.message);
        });

    console.log('Server listening on port: ' + PORT);
})