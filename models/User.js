const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        default: ''
    },
    birthDate: {
        type: Date,
        default: ''
    },
    wins: {
        type: Number,
        default: 0
    }
});

module.exports = User = mongoose.model('users', UserSchema);