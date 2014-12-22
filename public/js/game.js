$(function() {

	$('canvas').mousemove(function(event) {
		if (!myTank.gameOver) {
			myTank.moveTurret(event.pageX,event.pageY);
		}
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

// Socket events
socket.on('canvasUpdate', function(data) {
	receiveUpdate(data.attributes);
});

socket.on('updateBullets', function(data) {
	enemyBullets = data.bullets;
});

socket.on('takeDamage', function(data) {
	myTank.health -= data.damage;
});

socket.on('iLost', function(data) {
	myTank.gameOver = 1;
	dieCenter = data.dieCenter;
	explosionColor = data.color.explosion;
});
