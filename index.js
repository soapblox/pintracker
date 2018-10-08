var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentState = "";

var aPressed = false;

var GamePad = require('node-gamepad');
var controller = new GamePad('logitech/gamepadf310');

try {
    controller.connect();
} catch (e) {
    console.log("can't find controller...")
}

controller.on('A:press', function () {
    console.log('A:press');

    if (aPressed) {
        console.log('send controllerStop');
        io.emit('controllerStop', 'controllerStop');
    }
    else {
        io.emit('controllerStart', 'controllerStart');
    }

    aPressed = !aPressed;
});

controller.on('B:press', function () {
    console.log('B:press');
    io.emit('controllerSave', 'controllerSave');
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