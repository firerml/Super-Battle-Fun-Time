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

	// Updates canvus based on the enemy tank's properties
	client.on('canvasUpdate', function(data) {
		client.broadcast.emit('canvasUpdate', data);
	});

	client.on('takeDamage', function(damage) {
		client.broadcast.emit('takeDamage', damage);
	});

	client.on('get users', function(data) {
		client.emit('get users', usernames)
	});

	client.on('send message', function(data) {
		client.broadcast.emit('send message', data);
		client.emit('send message', data);
	});

	client.on('iLost', function(data) {
		client.broadcast.emit('iLost', data);
	});

	// Listen for client emiting 'add user' event
	client.on('add user', function(username) {
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

	client.on('send challenge', function(data) {
	  var enemyid = data['enemy'];
	  var playerid = data['player'];
	  client.broadcast.emit('send challenge', data);
	});

	// Listen for client emiting 'updateBullets' event
	client.on('updateBullets', function(data) {
		client.broadcast.emit('updateBullets',data);
	});

	client.on('commence game', function(data) {
		console.log('Server got your commence game message!');
		console.log(data['enemy']);
		client.broadcast.to(data['enemy']).emit('commence game',data);
		var newData = {player: data.enemy, playerColor: data.enemyColor, enemy: data.player, enemyColor: data.playerColor};
		client.emit('commence game',newData);
	});

	// When client's socket disconnects, remove user from
	// array of usernames, and broadcast updated usernames
	client.on('disconnect', function() {
		if(addedUser) {
			usernames.forEach(function(object) {
				if(object['id'] == client.id) {
					usernames.splice(usernames.indexOf(object),1);
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
