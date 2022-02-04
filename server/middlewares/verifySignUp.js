const db = require('../db/db');
const ROLES = db.ROLES;
const User = db.User;

const checkDublicateUsername = (req, res, next) => {
    User.findOne({login: req.body.login})
        .exec((err, user) => {
            if (err) return res.status(500).send({message: err.message});
            if (user) return res.status(400).send({message: 'This username is already taken'});
            next();
        })
}

const checkRolesExist = (req, res, next) => {
    if (req.body.roles) {
        const roles = JSON.parse(req.body.roles);
        // console.log(ROLES);
        // console.log(roles);
        for (let i = 0; i < roles.length; i++) {
            // console.log(ROLES.includes(roles), roles[i], ROLES[i]);
            if (!ROLES.includes(roles[i])) {
                return res.status(400).send({message: `Role ${roles[i]} doesn't exist`})
            }
        }
    }
    next();
}

module.exports = {
    checkDublicateUsername,
    checkRolesExist
}
