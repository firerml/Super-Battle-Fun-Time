socket = io.connect();

///////////////////////////
// IN GAME SOCKET EVENTS //
///////////////////////////

// Updates the canvas based on information received from enemy player
socket.on('canvasUpdate', function(data) {
	receiveUpdate(enemyTank, data.attributes);
});

// Updates the bullets based on information received from enemy player
socket.on('updateBullets', function(data) {
	enemyBullets = data.bullets;
});

// Reduces health when enemy sends info that it hit you
socket.on('takeDamage', function(data) {
	myTank.health -= data.damage;
});

// When the enemy's health hits zero you win
socket.on('iLost', function(data) {
	myTank.gameOver = 1;
	dieCenter = data.dieCenter;
	explosionColor = data.color.explosion;
});

// Adds a message to your end div
socket.on('rematch', function(data) {
	if (!($('#rematch-message').length)) {
		var rematchDiv = $('<div>').attr('id','rematch-notification');
		$('#end-message').text(data.player + ' demands a rematch!');
		var accept = $('<div>').attr('id','accept').text('Accept');
		var deny = $('<div>').attr('id','deny').addClass('red-message').text('Deny');
		$(rematchDiv).append(accept).append(deny);
		$('#end').append(rematchDiv);
		$('#rematch').remove();
		$('#return-to-lobby').remove();
	}
});

// The enemy left after a match by clicking 'return to lobby' or 'deny'
socket.on('iLeft', function(data) {
	if (data.enemy) socket.emit('change game state',data.enemy,false);
	$('#rematch').remove();
	$('#return-to-lobby').remove();
	var message;
	if (data.clicked === 'return-to-lobby') {
		message = (data.player + ' has left! Returning to lobby...');
		$('#end-message').text(message);
	}
	else if (data.disconnected === true) {
		socket.emit('change game state', myTank.player, false);
		message = ('Enemy has disconnected! Returning to lobby...');
		var endDiv = $('<div>').attr('id','end');
		var endMessage = $('<div>').attr('id','end-message').attr('class','red-message').text(message);
		$('body').append(endDiv.append(endMessage));
	}
	else if (data.clicked === 'deny') {
		message = (data.player + ' rejects your challenge! Returning to lobby...')
		$('#end-message').addClass('red-message').text(message);
	}
	clearInterval(timer);
	enemyTank = null;
	setTimeout(function() {
		$('#end').remove();
		$('canvas').hide();
		$('#lobby').show();
	}, 2000);
});

////////////////////////////
// Chatroom Socket Events //
////////////////////////////

// Lobby chat welcome message
socket.on('welcome message', function(data) {
	var chatmessages = $('.chatmessagescontainer');
	var message = $('<p>').addClass('message').attr('id', 'welcome-message').text(data);
	chatmessages.append(message);
});

// Gets users that are connected when you first join
socket.on('get users', addUser);

// Updates users when a user joins
socket.on('user joined', addUser);

function addUser(users) {
	var usersDiv = $('.current-users');
	usersDiv.empty();
	if (users.length > 0) {
		users.forEach(function(userObj) {
			var user = $('<div>').addClass('username-div');
			var usernamePar = $('<p>').addClass('username-text').text(userObj['name']);
			if (userObj.name.length > 10) {
				usernamePar.css('font-size','20px').css('line-height','.75');
			}
			user.append(usernamePar);
			user.attr('socketID', userObj['id']);
			usersDiv.append(user);
			if (userObj.name !== username && !userObj.ingame) {
				user.append($('<div>').addClass('challenge-button user-button').text('Battle'));
			}
			else if (userObj.name !== username && userObj.ingame) {
				user.append($('<div>').addClass('ingame-button user-button').text('In Game'));
			}
		});
	}
}

// Receives a message and displays it
socket.on('send message', function(data) {
	var chatmessages = $('.chatmessagescontainer');
	var messageTag = $('<p>').addClass('message').text(data.message);
	var userTag = $('<span>').addClass('username').text(data.name + ": ");
	messageTag.prepend(userTag);
	chatmessages.append(messageTag);
	chatmessages[0].scrollTop = chatmessages[0].scrollHeight;
});

// Receiving a challenge
socket.on('send challenge', function(data) {
	var message = $('<p>').addClass('message').addClass('challenge-message challenge-message-button').text(data.name + ' has challenged you! Click here to accept.').attr('invitation-id',data.player);
	$('.chatmessagescontainer').append(message);
});


// Starts a game between two people
socket.on('commence game', function(players) {
	$('.challenge-message').remove();
	socket.emit('change game state', players.player, true);
	$('canvas').show();
	$('#main-title').hide();
	$('#splashpage').hide();
	$('#lobby').hide();
	$('#end').remove();
	startGame(players.enemy, players.enemyColor, players.player, players.playerColor);
});

socket.on('change game state', function(playerID) {
	var users = $('.username-div');
	for (var i = 0; i < users.length; i++) {
		if (users.eq(i).attr('socketid') === playerID) {
			users.eq(i).find('.challenge-button').attr('class','ingame-button user-button').text('In Game');
		}
	}
});
