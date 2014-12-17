$(function() {
	
	$('canvas').mousemove(function(event) {
		if (myTank.nickname !== 'undefined') myTank.moveTurret(event.pageX,event.pageY);
	});

	socket.on('canvasUpdate', receiveUpdate);


});

function receiveUpdate(tankProperties) {
	enemyTank.setAttributes(tankProperties);
}