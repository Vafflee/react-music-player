const mongoose = require('mongoose');

const Composition = mongoose.model(
    'Composition',
    new mongoose.Schema({
        title: String,
        artist: String,
        file: String,
        cover: String
}));

module.exports = Composition;