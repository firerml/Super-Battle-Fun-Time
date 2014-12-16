//$ = require('jasmine-jquery');

var tank = require('../public/js/tank.js');

describe('Tank', function() {
  beforeEach(function() {
  });

  describe('coordinates', function() {
    it('should be an object', function() {
      expect(typeof tank.coordinates).toBe('object');
    });
    it('should hold numbers', function() {
      expect(typeof tank.coordinates.x).toBe('number');
      expect(typeof tank.coordinates.y).toBe('number');
    });
    it('should only hold positive numbers', function() {
      expect(tank.coordinates.x).toBeGreaterThan(0);
      expect(tank.coordinates.y).toBeGreaterThan(0);
    });
  });

  describe('dimensions', function() {
    it('should hold only positive numbers', function() {
      expect(tank.dimensions.width).toBeGreaterThan(0);
      expect(tank.dimensions.height).toBeGreaterThan(0);
    });
  });

  describe('bodyRotation', function() {
    it('should be a number', function() {
      expect(typeof tank.angle).toBe('number');
    });
  });

  describe('angle', function() {
    it('should be a number', function() {
      expect(typeof tank.angle).toBe('number');
    });
  });

  describe('turretRotation', function() {
    it('should be a number', function() {
      expect(typeof tank.turretRotation).toBe('number');
    });
  });

  describe('velocity', function() {
    it('should be a number', function() {
      expect(typeof tank.velocity).toBe('number');
    });
  });

  describe('upPressed, rightPressed, leftPressed, and downPressed', function() {
    it('should start with all four keys unpressed', function() {
      expect(tank.upPressed).toBe(false);
      expect(tank.rightPressed).toBe(false);
      expect(tank.leftPressed).toBe(false);
      expect(tank.downPressed).toBe(false);
    });
  });

describe('moveForward', function() {
  it('should decrease the tank y coordinate but not the x coordinate if the angle is 90 degrees', function() {
    tank.angle = (90 * Math.PI / 180);
    var startX = tank.coordinates.x;
    var startY = tank.coordinates.y;
    tank.moveForward();
    tank.moveForward();
    tank.moveForward();
    expect(tank.coordinates.y).toBeLessThan(startY);
    expect(tank.coordinates.x).toBe(startX);
  });
  it('should increase the tank x coordinate but not the y coordinate if the angle is 180', function() {
    tank.angle = (180 * Math.PI / 180);
    var startX = tank.coordinates.x;
    var startY = tank.coordinates.y;
    tank.moveForward();
    tank.moveForward();
    tank.moveForward();
    expect(Math.round(tank.coordinates.y)).toBe(Math.round(startY));
    expect(tank.coordinates.x).toBeGreaterThan(startX);
  });
  it('should increase the tank x coordinate and decrease the y coordinate equally if the angle is 135 degrees', function() {
    tank.angle = (135 * Math.PI / 180);
    var startX = tank.coordinates.x;
    var startY = tank.coordinates.y;
    tank.moveForward();
    tank.moveForward();
    tank.moveForward();
    var diffX = Math.abs(tank.coordinates.x - startX);
    var diffY = Math.abs(tank.coordinates.y - startY);
    expect(tank.coordinates.y).toBeLessThan(startY);
    expect(tank.coordinates.x).toBeGreaterThan(startX);
    expect(Math.round(diffX)).toBe(Math.round(diffY));
  });
  it('should increase the velocity if the velocity has not hit the max forward velocity', function() {
    tank.velocity = tank.maxForwardVelocity - 1;
    var vel = tank.velocity;
    tank.moveForward();
    tank.moveForward();
    tank.moveForward();
    expect(tank.velocity).toBeGreaterThan(vel);
  });
  it('should not increase the velocity if the velocity has hit the max forward velocity', function() {
    tank.velocity = tank.maxForwardVelocity;
    var vel = tank.velocity;
    tank.moveForward();
    tank.moveForward();
    tank.moveForward();
    expect(tank.velocity).toBe(vel);
  });
});

describe('moveBackwards', function() {
  it('should increase the tank y coordinate but not the x coordinate if the angle is 90 degrees', function() {
    tank.angle = (90 * Math.PI / 180);
    var startX = tank.coordinates.x;
    var startY = tank.coordinates.y;
    tank.moveBackwards();
    tank.moveBackwards();
    tank.moveBackwards();
    expect(tank.coordinates.y).toBeGreaterThan(startY);
    expect(tank.coordinates.x).toBe(startX);
  });
  it('should decrease the tank x coordinate but not the y coordinate if the angle is 180', function() {
    tank.angle = 180;
    var startX = tank.coordinates.x;
    var startY = tank.coordinates.y;
    tank.moveBackwards();
    tank.moveBackwards();
    tank.moveBackwards();
    expect(tank.coordinates.y).toBe(startY);
    expect(tank.coordinates.x).toBeLessThan(startX);
  });
  it('should decrease the tank x coordinate and increase the y coordinate equally if the angle is 135 degrees', function() {
    tank.angle = (135 * Math.PI / 180);
    var startX = tank.coordinates.x;
    var startY = tank.coordinates.y;
    tank.moveForward();
    tank.moveForward();
    tank.moveForward();
    var diffX = Math.abs(tank.coordinates.x - startX);
    var diffY = Math.abs(tank.coordinates.y - startY);
    expect(tank.coordinates.y).toBeGreaterThan(startY);
    expect(tank.coordinates.x).toBeLessThan(startX);
    expect(diffX).toBe(diffY);
  });
  it('should decrease the velocity if the velocity has not hit the max backwards velocity', function() {
    tank.velocity = tank.maxBackwardsVelocity + 1;
    var vel = tank.velocity;
    tank.moveBackwards();
    expect(tank.velocity).toBeLessThan(vel);
  });
  it('should not decrease the velocity if the velocity has hit the max backwards velocity', function() {
    tank.velocity = tank.maxBackwardsVelocity;
    var vel = tank.velocity;
    tank.moveBackwards();
    expect(tank.velocity).toBe(vel);
  });
});


  describe('updateTank', function() {
    it('should not change the velocity, angle, or tank coordinates if none of the keys are pressed and the velocity is 0', function() {
      tank.velocity = 0;
      var vel = tank.velocity;
      var ang = tank.angle;
      var coords = tank.coordinates
      tank.updateTank();
      tank.updateTank();
      tank.updateTank();
      expect(tank.velocity).toBe(vel);
      expect(tank.angle).toBe(angle);
      expect(tank.coordinates).toBe(coords);
    });
    it('should increase the velocity if upPressed is true', function() {
      var vel = tank.velocity;
      tank.upPressed = true;
      tank.updateTank();
      expect(tank.velocity).toBeGreaterThan(vel);
    });
    it('should decrease the velocity if the velocity is positive and upPressed is false', function() {
      tank.velocity = 3;
      var vel = tank.velocity;
      tank.upPressed = false;
      tank.updateTank();
      expect(tank.velocity).toBeLessThan(vel);
    });
    it('should increase the angle if leftPressed is true', function() {
      var ang = tank.angle;
      tank.leftPressed = true;
      tank.updateTank();
      expect(tank.angle).toBeGreaterThan(ang);
    });
    it('should decrease the angle if rightPressed is true', function() {
      var ang = tank.angle;
      tank.rightPressed = true;
      tank.updateTank();
      expect(tank.angle).toBeLessThan(ang);
    });
  });

  describe('slowDown', function() {
    it('should decrease the velocity if the velocity is greater than 0', function() {
      tank.velocity = 1;
      var vel = tank.velocity;
      tank.slowDown();
      expect(tank.velocity).toBeLessThan(vel);
    });
  });
});
