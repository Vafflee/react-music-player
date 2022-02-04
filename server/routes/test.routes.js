const express = require('express')
const testRouter = express.Router();
const authJwt = require('../middlewares/auth.jwt');
const controller = require('../controllers/test.controller');

testRouter.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

testRouter.route('/api/test/all').get(controller.allAccess);
testRouter.route('/api/test/user').get([authJwt.verifyToken], controller.userBoard);
testRouter.route('/api/test/admin').get([authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
testRouter.route('/api/test/test').get(controller.busboy);

module.exports = testRouter;