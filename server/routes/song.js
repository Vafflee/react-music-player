const express = require('express');
const songRoutes = express.Router();
const path = require('path');


// Get a song file by filename
songRoutes.route('/songfile/:filename').get((req, response) => {
    response.sendFile(path.join(__dirname, '../../data/music', req.params.filename + ".mp3"));
});
songRoutes.route('/songcover/:filename').get((req, response) => {
    response.sendFile(path.join(__dirname, '../../data/covers', req.params.filename + ".jpg"));
});

module.exports = songRoutes;