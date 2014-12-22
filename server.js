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

	client.on('commence game', function(data) {
		client.broadcast.to(data['enemy']).emit('commence game',data);
		var newData = {player: data.enemy, playerColor: data.enemyColor, enemy: data.player, enemyColor: data.playerColor};
		client.emit('commence game',newData);
	});

	client.on('canvasUpdate', function(data) {
		client.broadcast.to(data.enemy).emit('canvasUpdate', data);
	});

	client.on('takeDamage', function(data) {
		client.broadcast.to(data.enemy).emit('takeDamage', data);
	});

	client.on('iLost', function(data) {
		client.broadcast.to(data.enemy).emit('iLost', data);
	});

	client.on('updateBullets', function(data) {
		client.broadcast.to(data.enemy).emit('updateBullets',data);
	});


	client.on('get users', function(data) {
		client.emit('get users', usernames)
	});

	client.on('send message', function(data) {
		client.broadcast.emit('send message', data);
		client.emit('send message', data);
	});

	client.on('welcome message', function(data) {
		client.emit('welcome message', data);
	});

	client.on('add user', function(username) {
		// add the clients username to the global list of users
		var userObj = {};
		userObj['name'] = username;
		userObj['id'] = client.id;
		usernames.push(userObj)
		++numUsers;
		addedUser = true;
		client.broadcast.emit('user joined', usernames);
		client.emit('user joined', usernames);
	});

	client.on('send challenge', function(data) {
	  var enemyid = data['enemy'];
	  var playerid = data['player'];
	  client.broadcast.emit('send challenge', data);
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
