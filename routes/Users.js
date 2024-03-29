const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validateToken = require('../utils/utils').validateToken;

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
                        return res.json({
                            message: user.username + ' successfully registered!',
                        })
                    }).catch(err => {
                        return res.status(500).json({
                            message: 'Internal server error ' + err
                        })
                    })
            })
        } else {
            // if user is already registered
            return res.status(409).json({
                message: 'Username ' + req.body.username + ' is already taken!'
            })
        }
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
                let token = jwt.sign({
                    username: user.username
                }, process.env.SECRET_KEY, {
                    expiresIn: '24h'
                });

                return res.json({
                    token: token,
                    username: user.username
                });
            }
            // incorrect password
            return res.status(401).json({
                token: null,
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

users.get('/user', validateToken, function (req, res) {
    const token = req.headers.authorization;

    if (token) {
        const username = req.query.username;

        if (username) {
            User.findOne({
                username: username
            }).then(function (user) {
                const parsedDate = (user.birthDate) ? user.birthDate.toISOString().substr(0, 10) : '';
                return res.json({
                    username: user.username,
                    email: user.email,
                    birthDate: parsedDate
                })
            }).catch(err => {
                return res.status(500).json({
                    message: 'Internal server error '
                })
            })
        } else {
            return res.status(400).json({
                message: 'User not found!'
            })
        }
    } else {
        return res.status(401).send({
            message: 'unauthorized'
        });
    }
})

users.post('/updateInfo', validateToken, function (req, res) {
    const token = req.headers.authorization;
    const username = req.query.username;

    if (token) {
        const userData = req.body;
        User.updateOne({
            username: username
        }, userData).then(function (result) {
            if (result.ok === 1) {
                return res.sendStatus(200);
            } else {
                res.sendStatus(304);
            }
        }).catch(err => {
            return res.status(500).json({
                message: 'Internal server error '
            })
        })
    } else {
        return res.status(401).send({
            message: 'unauthorized'
        });
    }
})

users.get('/rankings', function (req, res) {

    User.find({}, {
        username: 1,
        wins: 1
    }).limit(20).sort({
        wins: -1
    }).then(function (users) {
        const usersData = users.map(user => {
            return {
                username: user.username,
                wins: user.wins
            }
        })
        return res.json(usersData)
    }).catch(err => {
        return res.status(500).json({
            message: 'Internal server error '
        })
    })
})

module.exports = users;