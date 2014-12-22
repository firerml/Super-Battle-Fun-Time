var username;
var enemyid;
$(function() {
	// Submit username to server with enter
	$('#login-input').keypress(function(event) {
		if(event.keyCode == 13) {
			username = $('#login-input').val();
			if (username == '') {
				alert('Please input a name');
			} else {
				var allUsersNames = $('.userscontainer').find('p');
				var copyName = false;
				if (allUsersNames.length > 0) {
					for (var i = 0; i < allUsersNames.length; i++) {
						if (allUsersNames.eq(i).text() === username) {
							alert("That username is taken!");
							copyName = true;
						}
					}
				}
				if (!copyName) {
					socket.emit('add user', username);
					$('#login-input').val('');
					$('#loginpage').hide();
				}
			}
		}
	});

	// Submit message to server with enter
	$('#messageinput').keypress(function(event) {
		if(event.keyCode == 13) {
			var message = $('#messageinput').val();
			if (message == '') {
				alert('Please input a message');
			} else {
				socket.emit('send message', {name: username, message: message});
				$('#messageinput').val('');
			}
		}
	});

	$('body').on('click', '.challenge-button', function() {
	  enemyid = $(this).parent().attr('socketid');
	  socket.emit('send challenge', {enemy: enemyid, player: socket.io.engine.id});
	});

	$('body').on('click', '.challenge-message', function(event) {
		var enId = $(this).attr('invitation-id');
		var greens = {main: '#11CF00', extra: '#D711ED', explosion: ['lime','#2BB31E','#1C8212']}
		var purples = {main: '#D711ED', extra: '#11CF00', explosion: ['#D711ED','#AC0DBD','#6B0876']}
		socket.emit('commence game',{enemy: enId, enemyColor: greens, player: socket.io.engine.id, playerColor: purples});
	});
});

// Socket Events
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

socket.on('commence game', function(players) {
	startGame(players.enemy, players.enemyColor, players.player, players.playerColor);
});

socket.on('welcome message', function(data) {
	var chatmessages = $('.chatmessagescontainer');
	var message = $('<p>').addClass('message').attr('id', 'welcome-message').text(data);
	chatmessages.append(message);
});
