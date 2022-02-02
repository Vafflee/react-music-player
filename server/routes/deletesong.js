const express = require('express');
const deleteRoutes = express.Router();
const path = require('path');
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

deleteRoutes.route('/deletesong/:id').delete(async (req, res) => {
    if (!req.params.id) return res.status(500).json({error: 'Empty id'});

    try {
        console.log('Deleting song: ' + req.params.id);
        
        db = dbo.getDb();
        const songToDelete = await db.collection('compositions').findOne({_id: ObjectId(req.params.id)});
        
        // Delete song object from MondoDB if it exists
        db.collection('compositions')
        .deleteOne({_id: ObjectId(req.params.id)}, (err) => {
            if (err) throw err;
            console.log(`    Object ${req.params.id} was deleted from MongoDB`);
        });

        // Delete mp3 file if it exist
        let deletepath = path.join(__dirname, '../../data/music', songToDelete.file + '.mp3');
        if (fs.existsSync(deletepath)) {
            fs.unlinkSync(deletepath);
            console.log('    File ' + songToDelete.file + '.mp3 was deleted');
        } else console.log('    There is no ' + songToDelete.file + '.mp3 file');
        
        // Delete cover file if it exist
        deletepath = path.join(__dirname, '../../data/covers', songToDelete.cover + '.jpg');
        if (fs.existsSync(deletepath)) {
            fs.unlinkSync(deletepath);
            console.log('    File ' + songToDelete.cover + '.jpg was deleted');
        } else console.log('    There is no ' + songToDelete.cover + '.jpg file');

        res.status(200).json({message: 'Song was deleted'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }

});

module.exports = deleteRoutes;