var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentState = "";

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/ui', function (req, res) {
    console.log("loading ui...");
    res.sendFile(__dirname + '/ui.html');
});

app.use(express.static('public'))

app.get('/simple', function (req, res) {
    console.log("loading simple...");
    res.sendFile(__dirname + '/simple.html');
});

app.get('/timer', function (req, res) {
    console.log("loading simple...");
    res.sendFile(__dirname + '/timer.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('paint', function (msg) {
        console.log('Index.js-paint');
        io.emit('paint', currentState);
    });

    socket.on('start', function (msg) {
        console.log('Index.js-start');
        // console.log(msg);
        currentState = msg;
        io.emit('start', msg);
    })

    socket.on('saveState', function (msg) {
        console.log('Index.js-saveState');
        currentState = msg;
    })

    socket.on('startTimer', function (msg) {
        console.log('Index.js-startTimer');
        io.emit('startTimer', msg);
    })

    socket.on('stopTimer', function (msg) {
        currentState = msg;
        console.log('Index.js-stopTimer');
        io.emit('stopTimer', currentState);
    })

    socket.on('uiTimerTime', function (msg) {
        console.log('uiTimerTime:' + msg);
        io.emit('uiTimerTime', msg);
    })

    socket.on('clearTimer', function (msg) {
        console.log('clearTimer');
        io.emit('clearTimer', msg);
    })
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});