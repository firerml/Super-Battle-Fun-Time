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
  
};
