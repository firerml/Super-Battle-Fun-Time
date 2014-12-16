var Tank = function(nickname) {
  this.player = nickname;
  this.coordinates = {x: 300, y: 300};
  this.dimensions = {width: 30, height: 30};
  this.velocity = 0;
  this.angle = (90 * Math.PI/180);
  this.maxForwardVelocity = 3;
  this.maxBackwardsVelocity = -0.8;
  this.forwardAccel = 0.04;
  this.backwardsAccel = 0.08;
  this.descel = 0.03;

  this.upPressed = false;
  this.rightPressed = false;
  this.leftPressed = false;
  this.downPressed = false;

  var self = this;
  $('body').on('keydown', function(event) {
    if (event.keyCode === 38) self.upPressed = true;
    if (event.keyCode === 39) self.rightPressed = true;
    if (event.keyCode === 37) self.leftPressed = true;
    if (event.keyCode === 40) self.downPressed = true;
  });
  $('body').on('keyup', function(event) {
    if (event.keyCode === 38) self.upPressed = false;
    if (event.keyCode === 39) self.rightPressed = false;
    if (event.keyCode === 37) self.leftPressed = false;
    if (event.keyCode === 40) self.downPressed = false;
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
    this.velocity -= this.descel;
  }
  else {
    this.velocity = 0;
  }
};

// module.exports = new Tank('Mike')
