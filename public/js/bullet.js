var Bullet = function(angle,xCoord,yCoord) {
  this.angle = angle + Math.PI/2;
  this.coordinates = {x: xCoord, y: yCoord};
  this.duration = 0;
  this.maxDuration = 200;
  this.moveX = Math.cos(angle - Math.PI/2);
  this.moveY = Math.sin(angle - Math.PI/2);

};

Bullet.prototype.move = function() {
  this.coordinates.x += 3*this.moveX;
  this.coordinates.y += 3*this.moveY;
};

Bullet.prototype.detectCollisions = function(tank) {
  var corners = tank.getCorners();
  return isInsideSquare(corners.tL, corners.tR, corners.bR, corners.bL, this.coordinates);
  };


function triangleArea(a,b,c) {
	return (c.x*b.y - b.x*c.y) - (c.x*a.y - a.x*c.y) + (b.x*a.y - a.x*b.y);
}

function isInsideSquare(a,b,c,d,p) {
	if (triangleArea(a,b,p) > 0 || triangleArea(b,c,p) > 0 || triangleArea(c,d,p) > 0 || triangleArea(d,a,p) > 0) {
		return false;
	}
	else {
    return true;
  }
}
