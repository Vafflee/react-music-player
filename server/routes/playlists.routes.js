const express = require('express');
const recordRoutes = express.Router();

const controller = require('../controllers/playlists.controller');

// Get a list of playlists
recordRoutes.route('/api/playlists').get(controller.all);
recordRoutes.route('/api/playlists/:id').get(controller.id);
// recordRoutes.route('/api/playlists/test').post(controller.createTestPlaylist);

module.exports = recordRoutes;