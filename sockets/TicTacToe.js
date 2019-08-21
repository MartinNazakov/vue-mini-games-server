const express = require('express');
const lobbies = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');

const TicTacToe = require('../models/games/TicTacToe');
const User = require('../models/User');
lobbies.use(cors());

module.exports = function (socket, io) {

    socket.on("makeMove", function (data) {
        const x = data.x;
        const y = data.y;
        const id = data.id;
        console.log(data);
        if (x !== null && y !== null && id) {
            TicTacToe.findOne({
                id: id
            }).then(function (game) {
                const newGame = game
                const currentSymbol = game.currentPlayerSymbol;
                game.board[x][y] = currentSymbol;

                if (checkWinner(game.board)) {
                    const winner = game.currentPlayerTurn;

                    User.findOne({
                        username: winner
                    }).then(function (user) {
                        var wins = user.wins;
                        wins++;
                        console.log(user.username);
                        User.updateOne({
                            username: user.username
                        }, {
                            wins: wins
                        }).then(function () {
                            io.in(id).emit('winner', winner);
                        })
                    })
                } else {
                    var newSymbol;

                    if (currentSymbol === 'X') {
                        newSymbol = 'O'
                    } else {
                        newSymbol = 'X'
                    }

                    const currentPlayerIndex = game.players.indexOf(game.currentPlayerTurn);

                    const nextPlayerIndex = (currentPlayerIndex === 0) ? 1 : 0;
                    const newPlayerTurn = game.players[nextPlayerIndex];

                    newGame.board = game.board;
                    newGame.currentPlayerSymbol = newSymbol;
                    newGame.currentPlayerTurn = newPlayerTurn;

                    TicTacToe.updateOne({
                        id: id,
                        currentPlayerSymbol: newSymbol,
                        currentPlayerTurn: newPlayerTurn,
                        board: game.board

                    }).then(function () {
                        io.in(id).emit('makeMove', newGame);
                    })
                }

            }).catch(err => {
                console.log(err);
            })
        }
    });

    function checkWinner(board) {
        for (var i = 0; i < board.length; i++) {

            if (board[i][0] == board[i][1] && board[i][0] == board[i][2] && board[i][0] != 0) {
                return true;
            }
        }
        for (var i = 0; i < board.length; i++) {

            if (board[0][i] == board[1][i] && board[0][i] == board[2][i] && board[0][i] != 0) {
                return true;
            }
        }

        if (board[0][0] == board[1][1] && board[0][0] == board[2][2] && board[0][0] != 0) {
            return true;
        }

        if (board[0][2] == board[1][1] && board[0][2] == board[2][0] && board[2][0] != 0) {
            return true;
        }

        return false;

    }
};