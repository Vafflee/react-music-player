const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.Composition = require('./models/composition.model');
db.Playlist = require('./models/Playlist.model');
db.User = require('./models/user.model');
db.Role = require('./models/role.model');
db.config = require('./db.config');

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;