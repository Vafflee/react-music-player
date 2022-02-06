const express = require('express')
const userRouter = express.Router();
const authJwt = require('../middlewares/auth.jwt');
const controller = require('../controllers/user.controller');

userRouter.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

userRouter.route('/api/user/like').post([authJwt.verifyToken], controller.like);
userRouter.route('/api/user/').get([authJwt.verifyToken], controller.user);

module.exports = userRouter;