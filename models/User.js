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
        type: String
    },
    birthDate: {
        type: Date
    }
});

module.exports = User = mongoose.model('users', UserSchema);