// Modules
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var jquery = require('jquery');

// Set a port for the server to listen
app.set('port', (process.env.PORT || 8000));

// Usernames which are currently connected
var usernames = [];
var numUsers = 0;


io.on('connection', function(client) {
	var addedUser = false;
	console.log("Client has connected...");

	// Updates canvus based on the enemy tank's properties
	client.on('canvasUpdate', function(data) {
		client.broadcast.emit('canvasUpdate', data);
	});

	client.on('takeDamage', function(damage) {
		client.broadcast.emit('takeDamage', damage);
	});

	// Listen for client emiting 'add user' event
	client.on('add user', function(username) {
		console.log(client.id);
		// add the clients username to the global list of users
		var userObj = {};
		userObj['name'] = username;
		userObj['id'] = client.id;
		usernames.push(userObj)
		++numUsers;
		addedUser = true;
		// echo globally that a user has connected
		client.broadcast.emit('user joined', usernames);
		// echo object back to client
		client.emit('user joined', usernames);
	});

	// Listen for client emiting 'updateBullets' event
	client.on('updateBullets', function(data) {
		client.broadcast.emit('updateBullets',data);
	});

	// When client's socket disconnects, remove user from 
	// array of usernames, and broadcast updated usernames
	client.on('disconnect', function() {
		if(addedUser) {
			usernames.forEach(function(object) {
				if(object['id'] == client.id) {
					usernames.pop(object);
					--numUsers;
				}
			})
		}
		client.broadcast.emit('user joined', usernames);
	});
});

// Load files that are in the public directory
app.use(express.static('public'));


// Make the server listen to the port defined above
server.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
})
