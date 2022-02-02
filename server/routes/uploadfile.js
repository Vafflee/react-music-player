const express = require('express');
const uploadRoutes = express.Router();
const path = require('path');
const dbo = require('../db/conn');

const validate = function(data) {
    if (!data.song) return {status: false, cause: 'empty song'};
    if (!data.song.mimetype === 'audio/mpeg') return {status: false, cause: 'song mimetype'};
    if (!data.cover) return {status: false, cause: 'empty cover'};
    if (!data.cover.mimetype === 'iage/jpeg') return {status: false, cause: 'cover mimetype'};
    if (!data.info) return {status: false, cause: 'no info'};
    if (!data.info.title) return {status: false, cause: 'empty title'};
    if (!data.info.artist) return {status: false, cause: 'empty artist'};
    return {status: true, cause: 'ok'};
}

uploadRoutes.route('/uploadfile/:info').post(async (req, res) => {
    try {
        
        if(!req.files) {
            res.send({
                status: false,
                message: 'No files uploaded'
            });
        } else {
            const song = req.files.song;
            const cover = req.files.cover;
            const info = JSON.parse(req.params.info);
            console.log('Uploading song: ' + info.title);

            const validated = validate({song: song, cover: cover, info: info});
            console.log('    Validated: ' + validated.status);

            if (validated.status) {
                
                let uploadpath = path.join(__dirname, '../../data/music', song.name);
                await song.mv(uploadpath, (err) => {
                    if (err)
                        return res.status(500).json({error: 'Songfile upload error'});
                    console.log('    Song uploaded to ' + uploadpath);
                });

                uploadpath = path.join(__dirname, '../../data/covers', cover.name);
                await cover.mv(uploadpath, (err) => {
                    if (err)
                        return res.status(500).json({error: 'Cover upload error'});
                    console.log('    Cover uploaded to ' + uploadpath);
                });

                const mongodata = {
                    title: info.title,
                    artist: info.artist,
                    file: song.name.replace('.mp3', ''),
                    cover: cover.name.replace('.jpg', ''),
                };
                const db = dbo.getDb();
                db.collection('compositions').insertOne(mongodata, (err) => {
                    if (err) throw err;
                    console.log('    One object inserted to MongoDB');
                });

                res.json({
                        status: true,
                        message: 'Files are uploaded',
                        data: {
                            song: song.name,
                            cover: cover.name,
                            info: info
                        }
                    });

            } else {
                res.status(500).json({error: 'Validate error', cause: validated.cause});
            }
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});
module.exports = uploadRoutes;