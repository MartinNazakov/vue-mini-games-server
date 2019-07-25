const mongoose = require('mongoose');
const Schema = mongoose.Schema

const LobbySchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    host: {
        type: String,
        required: true
    },
    gameType: {
        type: String,
        required: true,
    },
    maxPlayers: {
        type: Number,
        default: 2
    }
});

// Remove deprecation warnings, as mongoose hasn't been updated to handle them yet
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = Lobby = mongoose.model('lobbies', LobbySchema);