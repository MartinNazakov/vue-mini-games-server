var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();
var port = process.env.port || 5000;

var server = app.listen(port, function () {
    console.log('Server is running on port: ' + port);
})

// MongoDB Connection START --
const mongoURI = 'mongodb://localhost:27017/vuegame';

mongoose.connect(
        mongoURI, {
            useNewUrlParser: true
        }
    ).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))
// MongoDB Connection END --

var io = require('socket.io')(server);

// routes
var usersRoute = require('./routes/Users');
var lobbiesRoute = require('./routes/Lobbies');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use('/users', usersRoute)
app.use('/lobbies', lobbiesRoute)
// Socket Connection START --
io.on("connection", function (socket) {
    console.log("Socket Connection Established with ID :" + socket.id)
    require('./sockets/Lobbies')(socket, io);
})
// Socket Connection END --