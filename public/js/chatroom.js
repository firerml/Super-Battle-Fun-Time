$(function() {
	var username;
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
						console.log(username, allUsersNames.eq(i).text());
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
		}); 
	}
});

socket.on('send message', function(data) {
	var chatmessages = $('.chatmessagescontainer');
	var messageTag = $('<p>').addClass('message').text(data.message);
	var userTag = $('<span>').addClass('username').text(data.name + ": ");
	messageTag.prepend(userTag);
	chatmessages.append(messageTag);
})