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


