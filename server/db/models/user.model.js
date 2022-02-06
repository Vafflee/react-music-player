const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        login: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ],
        liked: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Song'
            }
        ]
    })
);

module.exports = User;