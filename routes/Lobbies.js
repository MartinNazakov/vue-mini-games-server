const express = require('express');
const lobbies = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validateToken = require('../utils/utils').validateToken;

const Lobby = require('../models/Lobby');
lobbies.use(cors());

process.env.SECRET_KEY = 'vuejs';

lobbies.post('/create', validateToken, (req, res) => {
    const lobbyData = req.body;
    console.log(lobbyData);
    
    Lobby.create(lobbyData)
        .then(createdLobby => {
            return res.json({
                lobbyData: createdLobby
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Internal server error ' + err
            })
        })
});

function decodeToken(token) {
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
        decoded = null
    }
    return decoded;
}

module.exports = lobbies;