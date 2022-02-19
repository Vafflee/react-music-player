const express = require('express')
const compositionsRoutes = express.Router();
const controller = require('../controllers/composition.controller');

compositionsRoutes.route('/api/songs/').get(controller.all);
compositionsRoutes.route('/api/songs/:id').get(controller.id);

module.exports = compositionsRoutes;