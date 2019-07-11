var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
var usersRoute = require('./routes/Users');

var app = express();
var port = process.env.port || 5000;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended:false
    })
)

const mongoURI = 'mongodb://localhost:27017/vuegame';

mongoose.connect(
    mongoURI,
    {useNewUrlParser: true}
).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.use('/users', usersRoute)

app.listen(port, function() {
    console.log('Server is running on port: ' + port);
})