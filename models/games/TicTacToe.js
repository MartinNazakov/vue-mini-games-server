const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const TicTacToeSchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    currentPlayerTurn: {
        type: String,
        default: ""
    },
    currentPlayerSymbol: {
        type: String,
        default: "X"
    },
    board: {
        type: [[String]],
        default: defaultBoard
    },
    players: [String]

});

// Remove deprecation warnings, as mongoose hasn't been updated to handle them yet
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = TicTacToe = mongoose.model('tictactoe', TicTacToeSchema);