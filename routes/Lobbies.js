const express = require('express');
const lobbies = express.Router();
const cors = require('cors');
const validateToken = require('../utils/utils').validateToken;

const Lobby = require('../models/Lobby');
lobbies.use(cors());


lobbies.get('/', validateToken, function (req, res) {
    const token = req.headers.authorization;
    if (token) {

        const gameType = req.query.gameType;

        Lobby.find({
            gameType: gameType
        }).then(function (lobbies) {
            if (lobbies && lobbies.length > 0) {
                return res.json(lobbies)
            } else {
                return res.status(404).send({
                    message: 'No lobbies found!'
                });
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

module.exports = lobbies;