$(function() {
	
	$('canvas').mousemove(function(event) {
		if (myTank.nickname !== 'undefined') myTank.moveTurret(event.pageX,event.pageY);
	});

	socket.on('canvasUpdate', receiveUpdate);

	socket.on('updateBullets', function(bulletsArray) {
		enemyBullets = bulletsArray;
	});


});

function receiveUpdate(tankProperties) {
	enemyTank.setAttributes(tankProperties);
}