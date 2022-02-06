const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../db/db');
const User = db.User;
const Role = db.Role;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).send({message: 'No x-access-token'});

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({message: 'Unauthorised: ' + err.message});
        req.userId = decoded.id;
        next();
    })
}

const isAdmin = (req, res, next) => {
    try {
        User.findById(req.userId)
        .exec((err, user) => {
            
            console.log(user);
            if (err) return res.status(500).send({message: err.message});
            Role.find({
                _id: { $in: user.roles }
            }, (err, roles) => {

                if (err) return res.status(500).send({message: err.message});
                console.log(roles);
                for (let i = 0; i < roles.length; i++) {
                    const role = roles[i];
                    if (role.name === 'admin') return next();
                }
                return res.status(403).send({message: 'Required admin role'});
            })
        })
    } catch (err) {
        return res.status(500).send({err: err.message});
    }
}

module.exports = {
    verifyToken,
    isAdmin
}