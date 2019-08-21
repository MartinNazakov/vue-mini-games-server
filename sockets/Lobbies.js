const express = require('express');
const lobbies = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');

const Lobby = require('../models/Lobby');
const TicTacToe = require('../models/games/TicTacToe');
lobbies.use(cors());

module.exports = function (socket, io) {

    socket.on("createLobby", function (data) {
        const lobbyData = data.lobby;
        if (lobbyData) {
            // create the room
            const lobby = new Lobby(lobbyData);
            lobby.save(function (err, lobby) {
                if (err) {
                    console.log(err);
                } else {
                    const lobbyid = lobby.id;
                    socket.join(lobbyid);
                    socket.emit('setLobby', lobby);
                    console.log('CREATE: Joined ID ' + lobbyid);
                }
            });
        }
    });

    socket.on("deleteLobby", function (data) {
        const lobbyId = data.lobbyId;
        if (lobbyId) {
            // delete the lobby
            Lobby.findOneAndRemove({
                id: lobbyId
            }, function (err, deleted) {
                if (err) {
                    console.log('Delete lobby error: ' + err);
                } else {
                    const id = (deleted) ? deleted.id : null;
                    if (id) {
                        io.in(id).emit('removeLobby');
                        socket.leave(id);
                        console.log('Lobby with id' + id + ' deleted!');
                    }
                }
            });
        }
    });

    socket.on("joinLobby", function (data) {
        const lobbyId = data.lobbyId;
        const user = data.user;
        if (lobbyId) {
            Lobby.findOne({
                id: lobbyId
            }, function (err, lobby) {
                if (err) {
                    console.log(err);
                } else {
                    const id = lobby.id;
                    const maxPlayers = lobby.maxPlayers;
                    const currentConnections = (socket.adapter.rooms[id]) ? socket.adapter.rooms[id].length : null;

                    if (currentConnections && maxPlayers > currentConnections) {
                        socket.join(id);
                        console.log('JOIN: Joined ID ' + lobbyId);
                        socket.emit('setLobby', lobby);
                        io.in(id).emit('joinUser', user);
                    } else {
                        socket.emit('lobbyFull');
                    }
                }
            });
        }
    });

    socket.on("leaveLobby", function (data) {
        const lobbyId = data.lobbyId;
        const user = data.user;

        socket.to(lobbyId).emit('leaveLobby', user);
        socket.leave(lobbyId);
        console.log('LEAVE: Left ID ' + lobbyId);
    });

    socket.on("startGame", function (data) {
        const gameType = data.gameType;
        const lobbyId = data.lobbyId;
        const players = data.players;

        var game;
        switch (gameType) {
            case "TicTacToe":
                // create the game
                game = new TicTacToe();
                game.players = players;

                // generate a random player to start the game
                var firstPlayerIndex = Math.round(Math.random());
                console.log(firstPlayerIndex);
                
                game.currentPlayerTurn = players[firstPlayerIndex];
                
                game.save(function (err, game) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.in(lobbyId).emit('startGame', game);
                        console.log('CREATE: TicTacToe game created! ' + game);
                    }
                });
        }
    });

    socket.on('joinGameRoom', function (data) {
        const id = data.id;
        socket.join(id);

        socket.emit('goToGame');
    })
};