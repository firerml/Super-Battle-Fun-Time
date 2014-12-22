socket = io.connect();


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
socket.on('get users', function(data) {
	var usersDiv = $('.current-users');
	usersDiv.empty();
	if (data.length > 0) {
		data.forEach(function(object) {
			var user = $('<div>').addClass('username-div');
			user.append($('<p>').addClass('username-text').text(object['name']));
			user.attr('socketID', object['id']);
			usersDiv.append(user);
			if (object.name !== username) {
				user.append($('<div>').addClass('challenge-button').text('Challenge!'));
			}
		});
	}
});

// Updates users when a user joins
socket.on('user joined', function(data) {
	var usersDiv = $('.current-users');
	usersDiv.empty();
	data.forEach(function(object) {
		var user = $('<div>').addClass('username-div');
		user.append($('<p>').addClass('username-text').text(object['name']));
		user.attr('socketID', object['id']);
		usersDiv.append(user);
		if (object.name !== username) {
			user.append($('<div>').addClass('challenge-button').text('Challenge!'));
		}
	});
});

// Receives a message and displays it
socket.on('send message', function(data) {
	var chatmessages = $('.chatmessagescontainer');
	var messageTag = $('<p>').addClass('message').text(data.message);
	var userTag = $('<span>').addClass('username').text(data.name + ": ");
	messageTag.prepend(userTag);
	chatmessages.append(messageTag);
});

// Receiving a challenge
socket.on('send challenge', function(data) {
	var message = $('<p>').addClass('message').addClass('challenge-message').text(data.player + ' has challenged you! Click here to accept.').attr('invitation-id',data.player);
	$('.chatmessagescontainer').append(message);
});


// Starts a game between two people
socket.on('commence game', function(players) {
	startGame(players.enemy, players.enemyColor, players.player, players.playerColor);
});
