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

	socket.on('iLost', function(enemyDieCenter) {
		myTank.gameOver = 1;
		dieCenter = enemyDieCenter;
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
