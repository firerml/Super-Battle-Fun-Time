var Bullet = function(angle,xCoord,yCoord) {
  this.angle = angle + Math.PI/2;
  this.coordinates = {x: xCoord, y: yCoord};
  this.moveX = Math.cos(angle - Math.PI/2);
  this.moveY = Math.sin(angle - Math.PI/2);
};

Bullet.prototype.move = function() {
  this.coordinates.x += 5*this.moveX;
  this.coordinates.y += 5*this.moveY;
};