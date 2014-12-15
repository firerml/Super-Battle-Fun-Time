// Modules
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
	console.log("Client has connected...");
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

server.listen(8000);

