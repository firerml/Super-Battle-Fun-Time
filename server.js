// Modules
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var jquery = require('jquery');


app.set('port', (process.env.PORT || 8000));

io.on('connection', function(client) {

	console.log("Client has connected...");

	client.on('canvasUpdate', function(data) {
		client.broadcast.emit('canvasUpdate', data);
		//client.emit('canvasUpdate', data);
	});

	client.on('updateBullets', function(data) {
		client.broadcast.emit('updateBullets',data);
	});

});

app.use(express.static('public'));

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/public/views/index.html');
// });

server.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
})
