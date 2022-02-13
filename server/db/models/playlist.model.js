const mongoose = require('mongoose');

const Playlist = mongoose.model(
    'Playlist',
    new mongoose.Schema({
        name: String,
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Composition'
            }
        ]
    })
)

module.exports = Playlist;