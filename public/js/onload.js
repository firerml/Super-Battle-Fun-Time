var username;
var enemyid;
var greens = {main: '#11CF00', extra: '#D711ED', explosion: ['lime','#2BB31E','#1C8212']};
var purples = {main: '#D711ED', extra: '#11CF00', explosion: ['#D711ED','#AC0DBD','#6B0876']};

$(function() {
	// Make lobby appear
	$('#splashbutton').on('click', function() {
		$('#splashpage').hide();
		socket.emit('get users', "getting users");
		socket.emit('welcome message', "Welcome to Super Battle Fun Time. " +
			"Here you can see other users, chat with each other, and challenge them to a battle!" +
			" Have fun!");
		$('#splashpage').hide();
		$('#lobby').show();
		$('#loginpage').show();
	});

	// Submit username to server with enter
	$('#login-input').keypress(function(event) {
		var allUsersNames = $('.userscontainer').find('p');
		var badName = false;
		if (event.keyCode === 13) {
			username = $('#login-input').val();
			if (username == '') {
				alert('Please input a name');
				badName = true;
			}
			else if (username.length > 40) {
				alert('That username is too long!');
				badName = true;
			}
			else if (allUsersNames.length > 0) {
				for (var i = 0; i < allUsersNames.length; i++) {
					if (allUsersNames.eq(i).text() === username) {
						alert("That username is taken!");
						badName = true;
					}
				}
			}
			if (!badName) {
				socket.emit('add user', username);
				$('#login-input').val('');
				$('#loginpage').hide();
			}
		}
	});

	// Submit message to server when you press enter
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

	// Submit message to server when you press the Send button
	$('.sendbutton').on('click', function() {
		var message = $('#messageinput').val();
		if (message == '') {
			alert('Please input a message');
		} else {
			socket.emit('send message', {name: username, message: message});
			$('#messageinput').val('');
		}
	});

	// Sends a challenge when you press the challenge button
	$('body').on('click', '.challenge-button', function() {
		var messageContainer = $('.chatmessagescontainer');
		var sentChallenge = $('<p>').addClass('message').addClass('challenge-message');
		var challengee = $(this).parent().find('p').text();
		sentChallenge.text('You have invited ' + challengee + ' to a game. Awaiting response...');
		messageContainer.append(sentChallenge);
	  enemyid = $(this).parent().attr('socketid');
	  socket.emit('send challenge', {enemy: enemyid, player: socket.io.engine.id, name: username});
	});

	// Starts a game when you accept the challenge by clicking on the challenge message
	$('body').on('click', '.challenge-message', function(event) {
		var enId = $(this).attr('invitation-id');
		$(this).remove();
		socket.emit('commence game',{enemy: enId, enemyColor: greens, player: socket.io.engine.id, playerColor: purples});
	});

	// Sends a rematch message to the enemy when the rematch button is clicked
	$('body').on('click', '#rematch', function(event) {
		$('#rematch').remove();
		$('#return-to-lobby').remove();
		$('#end-message').text('Rematch request sent! Awaiting a response...');
		socket.emit('rematch', {enemy: enemyTank.player, player: username});
	});

	$('body').on('click', '#accept', function(event) {
		socket.emit('commence game',{enemy: enemyTank.player, enemyColor: greens, player: socket.io.engine.id, playerColor: purples});
	});

	$('body').on('click', '#deny', returnToLobby);
	$('body').on('click', '#return-to-lobby', returnToLobby);

	function returnToLobby(event) {
		socket.emit('change game state', myTank.player, false);
		socket.emit('iLeft', {clicked: event.currentTarget.id, enemy: enemyTank.player, player: username});
		$('#end').remove();
		$('canvas').hide();
		$('#lobby').show();
	}

	// Moves turret based on mouse movement
	$('canvas').mousemove(function(event) {
		if (!myTank.gameOver) {
			myTank.moveTurret(event.pageX,event.pageY);
		}
	});

	// Fires a bullet during game on click
	$('body').on('click','#canvas', function() {
		if (!myTank.gameOver) {
			myTank.createBullet()
		}
	});

	// Move tank when buttons are pressed
	$('body').on('keydown', function(event) {
    // event.preventDefault();
    if (myTank && !myTank.gameOver) {
      if (event.keyCode === 38 || event.keyCode === 87) myTank.upPressed = true;
      if (event.keyCode === 39 || event.keyCode === 68) myTank.rightPressed = true;
      if (event.keyCode === 37 || event.keyCode === 65) myTank.leftPressed = true;
      if (event.keyCode === 40 || event.keyCode === 83) myTank.downPressed = true;
    }
  });

  // Stop moving tank when buttons are not pressed
  $('body').on('keyup', function(event) {
    if (myTank && !myTank.gameOver) {
      if (event.keyCode === 38 || event.keyCode === 87) myTank.upPressed = false;
      if (event.keyCode === 39 || event.keyCode === 68) myTank.rightPressed = false;
      if (event.keyCode === 37 || event.keyCode === 65) myTank.leftPressed = false;
      if (event.keyCode === 40 || event.keyCode === 83) myTank.downPressed = false;
    }
  });
});
