const express = require('express');
const songRoutes = express.Router();
const dbo = require('../db/conn');
const {ObjectId, GridFSBucket} = require('mongodb');
const fs = require('fs');
const path = require('path');


// Get a song file by filename
songRoutes.route('/songfile/:filename').get((req, response) => {
    response.sendFile(path.join(__dirname, '../../data/music', req.params.filename));
});

// // Get a test song
// songRoutes.route('/songfile').get((req, response) => {
//     response.sendFile(__dirname + '/test.mp3');
// });

// // Get a song readable stream by id
// songRoutes.route('/songstream/:id').get((req, response) => {

//     const bucket = new GridFSBucket(dbo.getDb());
//     const stream = bucket.openDownloadStream(ObjectId(req.params.id));
//     response.send(stream.read(255));
        
// });

// // Get a song file by id
// songRoutes.route('/songfile/:id').get((req, response) => {

//     const bucket = new GridFSBucket(dbo.getDb());

//     bucket.openDownloadStream(ObjectId(req.params.id))
//         .pipe(fs.createWriteStream('./routes/temp.mp3'))
//         .on('error', ()=>{
//             console.log("Some error occurred in download:"+error);
//             response.send(error);
//         })
//         .on('finish', ()=>{
//             console.log("done downloading");
//             response.sendFile(__dirname + '/temp.mp3');
//         });

// });

module.exports = songRoutes;