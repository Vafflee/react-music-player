const express = require('express');
const uploadRoutes = express.Router();
const path = require('path');
const dbo = require('../db/conn');
const db = require('../db/db');
const Composition = db.Composition;
const fs = require('fs');
const authJwt = require('../middlewares/auth.jwt');

const validate = async function(data) {
    // Chek empty data
    if (!data.song) return {status: false, cause: 'empty song'};
    if (!data.song.mimetype === 'audio/mpeg') return {status: false, cause: 'song mimetype'};
    if (data.cover) {
        if (!data.cover.mimetype === 'iage/jpeg') return {status: false, cause: 'cover mimetype'};
        if (fs.existsSync(path.join(__dirname, '../../data/covers', data.cover.name)))
        return {status: false, cause: 'cover file exist on server'};
    }
    if (!data.info) return {status: false, cause: 'no info'};
    if (!data.info.title) return {status: false, cause: 'empty title'};
    if (!data.info.artist) return {status: false, cause: 'empty artist'};
    // Check song existing
    if (await dbo.getDb().collection('compositions').findOne({title: data.info.title, artist: data.info.artist}))
        return {status: false, cause: 'song exist in mongodb'};
    if (fs.existsSync(path.join(__dirname, '../../data/music', data.song.name)))
        return {status: false, cause: 'song file exist on server'};
    return {status: true, cause: 'ok'};
}

uploadRoutes.route('/uploadfile/:info').post([authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
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

            const validated = await validate({song: song, cover: cover, info: info});
            console.log('    Validated: ' + validated.status);

            if (validated.status) {
                
                let uploadpath = path.join(__dirname, '../../data/music', song.name);
                await song.mv(uploadpath, (err) => {
                    if (err)
                        return res.status(500).json({error: 'Songfile upload error'});
                    console.log('    Song uploaded to ' + uploadpath);
                });

                if (cover) {
                    uploadpath = path.join(__dirname, '../../data/covers', cover.name);
                    await cover.mv(uploadpath, (err) => {
                        if (err)
                        return res.status(500).json({error: 'Cover upload error'});
                        console.log('    Cover uploaded to ' + uploadpath);
                    });
                }

                const mongodata = {
                    title: info.title,
                    artist: info.artist,
                    file: song.name.replace('.mp3', ''),
                    cover: cover ? cover.name.replace('.jpg', '') : null,
                };
                const composition = new Composition(mongodata);
                composition.save(err => {
                    if (err) return res.status(500).json({message: 'Mongoose save error', error: err.message});
                    res.json({
                        status: true,
                        message: 'Files are uploaded',
                        data: {
                            song: song.name,
                            cover: cover ? cover.name : null,
                            info: info
                        }
                    });
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