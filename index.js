var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentState = "";

var GamePad = require('node-gamepad');
var controller = new GamePad('logitech/gamepadf310');

try {
    controller.connect();
    console.log("connected to controller:");
} catch (e) {
    console.log("can't find controller...")
}

controller.on('A:press', function () {
    console.log('A:press');
    io.emit('controllerStart', 'controllerStart');
});

controller.on('B:press', function () {
    console.log('B:press');
    io.emit('controllerSave', 'controllerSave');
});

controller.on('X:press', function () {
    console.log('X:press');
    io.emit('controllerClear', 'controllerClear');
});

controller.on('LB:press', function () {
    console.log('LB:press');
    io.emit('playerLeft', 'playerLeft');
});

controller.on('RB:press', function () {
    console.log('RB:press');
    io.emit('playerRight', 'playerRight');
});

controller.on('LT:press', function () {
    console.log('LT:press');
    io.emit('objectiveLeft', 'objectiveLeft');
});

controller.on('RT:press', function () {
    console.log('RT:press');
    io.emit('objectiveRight', 'objectiveRight');
});

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

    socket.on('startTimer', function (msg) {
        console.log('Index.js-startTimer');
        io.emit('startTimer', msg);
    })

    socket.on('stopTimer', function (msg) {
        currentState = msg;
        console.log('Index.js-stopTimer');
        io.emit('stopTimer', currentState);
    })

    socket.on('clearTimer', function (msg) {
        console.log('clearTimer');
        io.emit('clearTimer', msg);
    })
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});