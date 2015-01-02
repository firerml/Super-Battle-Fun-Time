// Updates the enemy tank's properties from the information received from the enemy
function receiveUpdate(enemyTank,tankProperties) {
	enemyTank.setAttributes(tankProperties);
}

function tankOrWallCollisions(side) {
	var wallCollision = false;
	for (var i = 0; i < walls.length; i++) {
		if (detectSquareCollisions(myTank, walls[i].getCorners(), side)) wallCollision = true;
	}
	var tankCollision = detectSquareCollisions(myTank,enemyTank.collisionPoints(), side);
	if (wallCollision || tankCollision) return true;
	return false;
}

// Checks if a tank is about to enter a square's four corners
// The 'side' argument is so that you can always go the opposite direction out of a collided square
function detectSquareCollisions(tank,squareCorners,side) {
	var tankPoints = tank.collisionPoints(true);
	var keys;
	if (side === 'front') {
		keys = ['fr','tR','tL'];
	}
	else {
		keys = ['bR', 'bL'];
	}
	var collision = false;
	for (var i = 0; i < keys.length; i++) {
		if (detectPointCollisions(squareCorners, tankPoints[keys[i]])) {
			collision = true;
		}
	}
	return collision;
}

// Checks if a point is inside a square
function detectPointCollisions(corners,point) {
  return isInsideSquare(corners.tL, corners.tR, corners.bR, corners.bL, point);
}

// Checks if 'p' is inside a square with corners 'a,b,c,d'
function isInsideSquare(a,b,c,d,p) {
	if (triangleArea(a,b,p) > 0 || triangleArea(b,c,p) > 0 || triangleArea(c,d,p) > 0 || triangleArea(d,a,p) > 0) {
		return false;
	}
	else {
    return true;
  }
}

// Calculates a triangles area, used for isInsideSquare
function triangleArea(a,b,c) {
	return (c.x*b.y - b.x*c.y) - (c.x*a.y - a.x*c.y) + (b.x*a.y - a.x*b.y);
}

// Generates a Win/Lose message on your screen
function endMessage() {
	var message;
	if (myTank.gameOver > 0) message = 'You win!';
	else if (myTank.gameOver < 0) message = 'You lose!';
	var endDiv = $('<div>').attr('id','end');
	var endMessage = $('<div>').attr('id','end-message').text(message);
	var rematch = $('<div>').attr('id','rematch').text('Request A Rematch');
	var returnToLobby = $('<div>').attr('id','return-to-lobby').text('Return To Lobby')
	$(endDiv).append(endMessage).append(rematch).append(returnToLobby);
	$('body').append(endDiv);
}
