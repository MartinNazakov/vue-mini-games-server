const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');

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
    
        }
    })
});

