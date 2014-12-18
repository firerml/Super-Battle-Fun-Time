$(function() {

	$('canvas').mousemove(function(event) {
		myTank.moveTurret(event.pageX,event.pageY);
	});


	// Socket events
	socket.on('canvasUpdate', receiveUpdate);

	socket.on('updateBullets', function(bulletsArray) {
		enemyBullets = bulletsArray;
	});

	socket.on('takeDamage', function(damage) {
		myTank.health -= damage;
	});

});

function receiveUpdate(tankProperties) {
	enemyTank.setAttributes(tankProperties);
}
