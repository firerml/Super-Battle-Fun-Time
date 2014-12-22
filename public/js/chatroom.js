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

// Establishes socket connection and loads chat lobby
function connectToLobby() {
	$('#splashpage').hide();
	socket.emit('get users', "getting users");
	socket.emit('welcome message', "Welcome to the Super Battle Fun Time lobby chat. " + 
		"Here you can see other users connected, send messages to each other, and challenge them to a battle!" +
		" Have fun!");
	$('#splashpage').hide();
	$('#lobby').show();
	$('#loginpage').show();
}


