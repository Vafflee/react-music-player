const config = require('../config/auth.config');
const db = require('../db/db');
const User = db.User;
const Role = db.Role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
    const user = new User({
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 8),
        liked: []
    });
    user.save((err, user) => {
        if (err) return res.status(500).send({message: err.message});
        try {
            if (req.body.roles) {
                Role.find({
                    name: { $in: JSON.parse(req.body.roles) }
                }, (err, roles) => {

                    console.log(JSON.parse(req.body.roles));
                    console.log(roles);
                    if (err) return res.status(500).send({message: err.message});
                    user.roles = roles.map(role => role._id);
                    user.save(err => { 
                        if (err) return res.status(500).send({message: err.message});
                        return res.status(200).send({message: 'User registered succesfully'});
                    });

                })
            }
        } catch (err) {
            res.status(400).send({message: 'Roles parce error', err: err.message})
        }

    });
}

exports.signin = (req, res) => {
    // console.log(req.body);
    User.findOne({login: req.body.login})
        .populate('roles')
        .exec((err, user) => {

            if (err) return res.status(500).send({message: err.message});
            if (!user) return res.status(404).send({message: 'User not found'});
            
            const passIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passIsValid) return res.status(401).send({accessToken: null, message: 'Wrong password'});
             
            const token = jwt.sign({ id: user._id}, config.secret);

            const authorities = [];
            
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
            }

            res.status(200).send({
                id: user._id,
                accessToken: token
            });
            
        })
}

exports.verifyUser = (req, res) => {
    console.log('userId: ' + req.userId);
    User.findById(req.userId)
    .then(((user) => {
        // console.log(err);
        // if (err) return res.status(500).send({message: err.message})
        if (!user) return res.status(401).send({message: 'Unauthorised'})
        res.status(200).send({message: 'verified'});
    }))
    .catch(err => res.status(500).send({message: err.message}));
}