// Submit username to server with enter
$('#login-input').keypress(function(event) {
	if(event.keyCode == 13) {
		var username = $('#login-input').val();
		$('#login-input').val('');
		$('#loginpage').hide();
		// Tell the server your username
		socket.emit('add user', username);
	}
})

// Socket Events
socket.on('user joined', function(data) {
	var usersDiv = $('.current-users');
	usersDiv.empty();
	data.forEach(function(object) {
		var user = $('<div>').addClass('username-div');
		user.append($('<p>').addClass('username-text').text(object['name']));  
		user.attr('socketID', object['id']);
		usersDiv.append(user);		
	}) 
});

