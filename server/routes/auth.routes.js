const express = require('express')
const authRouter = express.Router();
const verifySignUp = require('../middlewares/verifySignUp');
const controller = require('../controllers/auth.controller');

authRouter.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

authRouter.route('/api/auth/signup')
    .post([
        verifySignUp.checkDublicateUsername, 
        verifySignUp.checkRolesExist
    ], controller.signup);

authRouter.route('/api/auth/signin').post(controller.signin);

module.exports = authRouter;