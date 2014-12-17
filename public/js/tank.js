var Tank = function(nickname, color) {
  this.player = nickname;
  this.coordinates = { x: 400 * Math.random()*5, y: 400 * Math.random() };
  this.dimensions = {width: 30, height: 30};
  this.velocity = 0;
  this.angle = (90 * Math.PI/180);
  this.maxForwardVelocity = 3;
  this.maxBackwardsVelocity = -0.8;
  this.forwardAccel = 0.04;
  this.backwardsAccel = 0.08;
  this.decel = 0.03;
  this.color = color;
  this.turretAngle = 0;

  this.upPressed = false;
  this.rightPressed = false;
  this.downPressed = false;
  this.leftPressed = false;

  var self = this;
  $('body').on('keydown', function(event) {
    if (event.keyCode === 38 || event.keyCode === 87) self.upPressed = true;
    if (event.keyCode === 39 || event.keyCode === 68) self.rightPressed = true;
    if (event.keyCode === 37 || event.keyCode === 65) self.leftPressed = true;
    if (event.keyCode === 40 || event.keyCode === 83) self.downPressed = true;
  });
  $('body').on('keyup', function(event) {
    if (event.keyCode === 38 || event.keyCode === 87) self.upPressed = false;
    if (event.keyCode === 39 || event.keyCode === 68) self.rightPressed = false;
    if (event.keyCode === 37 || event.keyCode === 65) self.leftPressed = false;
    if (event.keyCode === 40 || event.keyCode === 83) self.downPressed = false;
  });
};

Tank.prototype.updateTank = function() {
  if (this.downPressed) {
    this.moveBackwards();
  }
  // you shouldn't be able to press up and down at the same time! Down overrides up.
  else if (this.upPressed) {
    this.moveForward();
  }
  if (!this.upPressed && !this.downPressed && this.velocity !== 0) {
    this.slowDown();
  }
  if (this.rightPressed) {
    this.angle += (1 * Math.PI/180);
  }
  if (this.leftPressed) {
    this.angle -= (1 * Math.PI/180);
  }
};

Tank.prototype.moveForward = function() {
  if (this.velocity <= this.maxForwardVelocity - this.forwardAccel) {
    this.velocity += this.forwardAccel;
  }
  else {
    this.velocity = this.maxForwardVelocity;
  }

  this.coordinates.x -= Math.cos(this.angle)*this.velocity;
  this.coordinates.y -= Math.sin(this.angle)*this.velocity;
};

Tank.prototype.moveBackwards = function() {
  if (this.velocity >= this.maxBackwardsVelocity + this.backwardsAccel) {
    this.velocity -= this.backwardsAccel;
  }
  else {
    this.velocity = this.maxBackwardsVelocity;
  }

  this.coordinates.x -= Math.cos(this.angle)*this.velocity;
  this.coordinates.y -= Math.sin(this.angle)*this.velocity;
};

Tank.prototype.slowDown = function() {
  if (this.velocity > 0) {
    this.coordinates.x -= Math.cos(this.angle)*this.velocity;
    this.coordinates.y -= Math.sin(this.angle)*this.velocity;
    this.velocity -= this.decel;
  }
  else {
    this.velocity = 0;
  }
};

Tank.prototype.getAttributes = function() {
  return {
    player: this.player,
    coordinates: this.coordinates,
    dimensions: this.dimensions,
    velocity: this.velocity,
    angle: this.angle,
    maxForwardVelocity: this.maxForwardVelocity,
    maxBackwardsVelocity: this.maxBackwardsVelocity,
    forwardAccel: this.forwardAccel,
    backwardsAccel: this.backwardsAccel,
    decel: this.decel,
    turretAngle: this.turretAngle
  }
};

Tank.prototype.setAttributes = function(tankProps) {
  this.player = tankProps.player;
  this.coordinates = tankProps.coordinates;
  this.dimensions = tankProps.dimensions;
  this.velocity = tankProps.velocity;
  this.angle = tankProps.angle;
  this.maxForwardVelocity = tankProps.maxForwardVelocity;
  this.maxBackwardsVelocity = tankProps.maxBackwardsVelocity;
  this.forwardAccel = tankProps.forwardAccel;
  this.backwardsAccel = tankProps.backwardsAccel;
  this.decel = tankProps.decel;
  this.turretAngle = tankProps.turretAngle;
};

Tank.prototype.moveTurret = function(mouseX,mouseY) {
  var yDif = (mouseY - this.coordinates.y);
  var xDif = (mouseX - this.coordinates.x);

  this.turretAngle = (Math.atan2(yDif,xDif) + Math.PI/2);
};

Tank.prototype.createBullet = function() {
  var xCoord = 30*Math.cos(this.turretAngle - Math.PI/2) + this.coordinates.x;
  var yCoord = 30*Math.sin(this.turretAngle - Math.PI/2) + this.coordinates.y;
  var bullet = new Bullet(this.turretAngle,xCoord,yCoord);
  bullets.push(bullet);
};

Tank.prototype.getCorners = function() {
  var tL = {x: this.coordinates.x - this.dimensions.width/2,
        y: this.coordinates.y - this.dimensions.height/2 };
  var tR = {x: this.coordinates.x + this.dimensions.width/2,
        y: this.coordinates.y - this.dimensions.height/2 };
  var bL = {x: this.coordinates.x - this.dimensions.width/2,
        y: this.coordinates.y + this.dimensions.height/2 };
  var bR = {x: this.coordinates.x + this.dimensions.width/2,
        y: this.coordinates.y + this.dimensions.height/2 };
  return {tL: tL, tR: tR, bL: bL, bR: bR};
};

//module.exports = new Tank('Mike')
