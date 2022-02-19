const express = require('express');
const recordRoutes = express.Router();
const auth = require('../middlewares/auth.jwt');

const controller = require('../controllers/playlists.controller');

// Get a list of playlists
recordRoutes.route('/api/playlists').get(controller.all);
recordRoutes.route('/api/playlists/:id').get(controller.id);
recordRoutes.route('/api/playlists/add').post([auth.verifyToken, auth.isAdmin], controller.add);
recordRoutes.route('/api/playlists/remove').delete(controller.remove);
recordRoutes.route('/api/playlists/:playlistid/add/:songid').post([auth.verifyToken, auth.isAdmin], controller.id_add);
recordRoutes.route('/api/playlists/:playlistid/remove/:songid').delete([auth.verifyToken, auth.isAdmin], controller.id_remove);

module.exports = recordRoutes;