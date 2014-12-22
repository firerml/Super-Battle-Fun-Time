function receiveUpdate(enemyTank,tankProperties) {
	enemyTank.setAttributes(tankProperties);
}

function detectCollisions(tank,point) {
  var corners = tank.getCorners();
  return isInsideSquare(corners.tL, corners.tR, corners.bR, corners.bL, point);
}

function isInsideSquare(a,b,c,d,p) {
	if (triangleArea(a,b,p) > 0 || triangleArea(b,c,p) > 0 || triangleArea(c,d,p) > 0 || triangleArea(d,a,p) > 0) {
		return false;
	}
	else {
    return true;
  }
}

function triangleArea(a,b,c) {
	return (c.x*b.y - b.x*c.y) - (c.x*a.y - a.x*c.y) + (b.x*a.y - a.x*b.y);
}

function endMessage() {
	var message;
	if (myTank.gameOver > 0) message = 'You win!'; 
	else if (myTank.gameOver < 0) message = 'You lose!';
	endMessage = $('<div>').attr('id','end-message').text(message);
	$('body').append(endMessage);
}