$(function() {

	$('canvas').mousemove(function(event) {
		if (!myTank.gameOver) {
			myTank.moveTurret(event.pageX,event.pageY);
		}
	});


	// Socket events
	socket.on('canvasUpdate', receiveUpdate);

	socket.on('updateBullets', function(bulletsArray) {
		enemyBullets = bulletsArray;
	});

	socket.on('takeDamage', function(damage) {
		myTank.health -= damage;
	});

	socket.on('iLost', function(data) {
		myTank.gameOver = 1;
		dieCenter = data.dieCenter;
		explosionColor = data.color.explosion;
	});
});

function receiveUpdate(tankProperties) {
	enemyTank.setAttributes(tankProperties);
}

function endMessage() {
	var message;
	if (myTank.gameOver > 0) {
		message = 'You win!';
	}
	else if (myTank.gameOver < 0) {
		message = 'You lose!';
	}
	endMessage = $('<div>').attr('id','end-message').text(message);
	$('body').append(endMessage);
}
