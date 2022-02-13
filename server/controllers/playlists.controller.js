const mongoose = require('mongoose');
const db = require('../db/db');
const Playlist = db.Playlist;

exports.all = (req, res) => {
    try {
        Playlist.find({}, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({message: 'Getting playlists error', err: err.message});
            }
            res.status(200).send({playlists: results});
        })
    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Getting playlists error', err: err.message});
        }
    }
}

exports.id = (req, res) => {
    try {
        Playlist.findById(req.params.id, (err, playlist) => {
            if (err) {
                console.log(err);
                return res.status(500).send({message: 'Getting playlists error', err: err.message});
            }
            res.status(200).send(playlist);
        })
    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Getting playlists error', err: err.message});
        }
    }
}

exports.createTestPlaylist = (req, res) => {
    try {
        const playlist = new Playlist({
            name: 'test playlist 2',
            songs: [
                { _id: "61fa8e1921813880157c8134" },
                { _id: "61fa8e2421813880157c8135" },
                { _id: "61fa8e3421813880157c8137" },
                { _id: "61fa8e3d21813880157c8138" },
                { _id: "61fa8e4421813880157c8139" }
        ]
        });
        playlist.save(err => {
            if (err) {
                console.log(err);
                return res.status(500).send({message: 'Saving playlist error', err: err.message});
            }
            res.status(200).send({message: 'test playlist added succesfully'});
        });
    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'creating playlist error', err: err.message});
        }
    }
};