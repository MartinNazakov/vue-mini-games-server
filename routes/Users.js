const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'vuejs';

users.post('/register', (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }

    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            // hash the password before storing it
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                User.create(userData)
                    .then(user => {
                        res.json({
                            message: user.username + ' successfully registered!',
                        })
                    }).catch(err => {
                        return res.status(500).json({
                            message: 'Internal server error ' + err
                        })
                    })
            })
        }
        // if user is already registered
        return res.status(409).json({
            message: 'Username ' + req.body.username + ' is already taken!'
        })
    }).catch(err => {
        return res.status(500).json({
            message: 'Internal server error ' + err
        })
    })
});

users.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (user) {
            // check if passwords match
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // generate token
                let token = jwt.sign({}, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })

                res.json({
                    token: token
                });
            }
            // incorrect password
            return res.status(404).json({
                message: 'Incorrect password!'
            });
        }
        // user not found
        return res.status(404).json({
            message: 'User does not exist!'
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Internal server error ' + err
        })
    })
})

module.exports = users;