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
	console.log('User Joined:', data);
});

