// Modules
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var jquery = require('jquery');

// Set a port for the server to listen
app.set('port', (process.env.PORT || 8000));

// Usernames which are currently connected
var usernames = {};
var numUsers = 0;


io.on('connection', function(client) {

	var addedUser = false;

	console.log("Client has connected...");

	// Updates canvus based on the enemy tank's properties
	client.on('canvasUpdate', function(data) {
		client.broadcast.emit('canvasUpdate', data);
	});

	// Listen for client emiting 'add user' event
	client.on('add user', function(username) {
		console.log(client.id);
		// add the clients username to the global list of users
		usernames[username] = client.id;
		++numUsers;
		// echo globally that a user has connected
		client.broadcast.emit('user joined', {
			username: username,
			userID: client.id
		});
		client.emit('user joined', {
			username: username,
			userID: client.id
		});
	});
});

// Load files that are in the public directory
app.use(express.static('public'));


// Make the server listen to the port defined above
server.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
})
