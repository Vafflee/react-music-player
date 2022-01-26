const express = require('express');
const recordRoutes = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

// Get a list of records
recordRoutes.route('/record').get((req, res) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection('musicinfo')
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            res.json(result);
        });
});

// Get a record by id
recordRoutes.route('/record/:id').get((req, response) => {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id) };
    db_connect
        .collection('fs.files')
        .findOne(query, (err, result) => {
            if (err) throw err;
            response.json(result);
        });
});

module.exports = recordRoutes;