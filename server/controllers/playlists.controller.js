const mongoose = require('mongoose');
const express = require('express');
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

exports.id_add = (req, res) => {
    // if (!req.body) return res.status(400).send({message: 'No body'});
    if (!req.params.songid) return res.status(400).send({message: 'No songId'});
    if (!req.params.playlistid) return res.status(400).send({message: 'No playlistId'});

    console.log('Starting to add song in playlist');
    Playlist.findById(req.params.playlistid)
    .then(playlist => {
        if (playlist.songs.includes(mongoose.Types.ObjectId(req.params.songid))){
            consolelog('    This song is already in the playlists');
            return res.status(400).send({message: 'Song is already in this playlist'});
        }
        playlist.songs.push(mongoose.Types.ObjectId(req.params.songid));
        playlist.save(err => {
            if (err) {
                console.log('    Failed to add song');
                res.status(500).send({message: 'Saving playlists error', err: err.message})};
            console.log('    Song added to playlist');
            res.status(200).send({message: 'Song added to playlist'});
        });
    })
    .catch(err => {
        console.log('    Failed to add song');
        res.status(500).send({message: 'Getting playlists error', err: err.message})});
}

exports.id_remove = (req, res) => {
    // if (!req.body) return res.status(400).send({message: 'No body'});
    if (!req.params.songid) return res.status(400).send({message: 'No songId'});
    if (!req.params.playlistid) return res.status(400).send({message: 'No playlistId'});

    console.log('Removing song from playlist');
    Playlist.findById(req.params.playlistid)
    .then(playlist => {
        playlist.songs = playlist.songs.slice().filter(song => song._id != req.params.songid);
        playlist.save(err => {
            if (err) {
                console.log('    Failed to remove song from playlist');
                res.status(500).send({message: 'Saving playlists error', err: err.message})};
            console.log('    Song removed from playlist');
            res.status(200).send({message: 'Song removed from playlist'});
        });
    })
    .catch(err => {
        console.log('    Failed to add song');
        res.status(500).send({message: 'Getting playlists error', err: err.message})});
}

exports.add = (req, res) => {
    if (!req.body) return res.status(400).send({message: 'No body'});
    // console.log(req.body);
    if (!req.body.name) return res.status(400).send({message: 'No playlist name'});

    const playlist = new Playlist({
        name: req.body.name
    })
    playlist.save()
    .then(() => {
        console.log(`Playlist ${playlist.name} created succesfully`);
        res.status(200).send({message: `Playlist ${playlist.name} created succesfully`});
    })
    .catch(err => {
        console.log('Error ' + err.message);
        res.status(500).send({message: 'Playlist creating error', err: err.message});
    });
}

exports.remove = (req, res) => {
    console.log("Starting to delete a playlist");
    if (!req.body) return res.status(400).send({message: 'No body'});
    // console.log(req.body);
    if (!req.body.id) return res.status(400).send({message: 'No playlist id'});
    Playlist.findOneAndRemove({_id: mongoose.Types.ObjectId(req.body.id)})
    .then(() => {
        // if (err) return res.status(500).send({message: 'Mongoose delete error'});
        console.log("    Playlist succesfully deleted");
        return res.status(200).send({message: 'Playlist deleted'});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({message: 'Plylist removing error'});
    });
}