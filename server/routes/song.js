const express = require('express');
const songRoutes = express.Router();
const path = require('path');
const db = require('../db/db');
const Composition = db.Composition;


// Get a song file by filename
songRoutes.route('/songfile/:id').get((req, res) => {
    try {
        Composition.findById(req.params.id, (err, song) => {
            if (err) {
                console.log(err);
                return res.status(500).send({message: 'Getting playlists error', err: err.message});
            }
            res.sendFile(path.join(__dirname, '../../data/music', song.file + ".mp3"));
        });
    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Getting sonfile error', err: err.message});
        }
    }
});
songRoutes.route('/songcover/:id').get((req, res) => {
    try {
        Composition.findById(req.params.id, (err, song) => {
            if (err) {
                console.log(err);
                return res.status(500).send({message: 'Getting playlists error', err: err.message});
            }
            if (!song) {
                console.log("Song not found");
                return res.status(500).send({message: 'Song not found'});
            }
            res.sendFile(path.join(__dirname, '../../data/covers', song.cover + ".jpg"));
        });
    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Getting sonfile error', err: err.message});
        }
    }
});

module.exports = songRoutes;