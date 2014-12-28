var ctx;
var firstDeath;
var innerRadius;
var outerRadius;
var dieCenter;
var explosionColor;
var timer;
var deathClockSet;
var myTank;
var enemyTank;

// Assigns a tank to enemy and player, and starts the game
function startGame(myName,myColor,enemyName,enemyColor) {
  firstDeath = true;
  innerRadius = 5;
  outerRadius = 10;
  deathClockSet = false;
  bullets = [];
  enemyBullets = [];

  ctx = $('#canvas')[0].getContext('2d');
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  myTank = new Tank(myName,myColor);
  enemyTank = new Tank(enemyName,enemyColor);

  timer = setInterval(function() { updateCanvas(myTank,enemyTank) },15);
}

// Re-draws the game based on updated info
function updateCanvas(myTank,enemyTank) {
  refreshCanvas();
  drawTank(enemyTank);
  drawTurret(enemyTank);
  drawTank(myTank);
  drawTurret(myTank);
  if (bullets.length > 0) drawBullets(bullets);
  if (enemyBullets.length > 0) drawBullets(enemyBullets);
  drawBullets(enemyBullets);
  if (myTank.health <= 0 && firstDeath) {
    myTank.gameOver = -1;
    dieCenter = myTank.coordinates;
    explosionColor = myTank.color.explosion;
    socket.emit('iLost', {enemy: enemyTank.player, dieCenter: dieCenter, color: myTank.color});
    firstDeath = false;
  }
  if (!myTank.gameOver) {
    myTank.updateTank();
    updatePlayerBullets(bullets);
  }
  else {
    dieAnim(dieCenter,explosionColor);
  }
  socket.emit('canvasUpdate', {enemy: enemyTank.player, attributes: myTank.getAttributes()});
  socket.emit('updateBullets', {enemy: enemyTank.player, bullets: bullets});
}

// updates all the bullets are fired by the player
function updatePlayerBullets(bulletArray) {
  bulletArray.forEach(function(bullet) {
    bullet.move();
    var hit = detectCollisions(enemyTank,bullet.coordinates);
    if (hit || bullet.coordinates.x < 0 || bullet.coordinates.x > canvas.width || bullet.coordinates.y < 0 || bullet.coordinates.y > canvas.height) {
      bulletArray.splice(bulletArray.indexOf(bullet),1);
      bullet = null;
      if (hit) {
        socket.emit('takeDamage', {enemy: enemyTank.player, damage: 5});
      }
    }
  });
}

// Draws the tank
function drawTank(tank) {
  ctx.save();
  ctx.translate(tank.coordinates.x,tank.coordinates.y);
  ctx.rotate(tank.angle);
  var fillPercent = tank.health/100;
  var emptyWidth = tank.dimensions.width - fillPercent*tank.dimensions.width;
  var fullWidth = fillPercent*tank.dimensions.width;
  ctx.fillStyle = tank.color.main;
  ctx.strokeStyle = tank.color.main;
  // Draws an empty rectangle whose height indicates missing health
  ctx.strokeRect(tank.dimensions.width*(-0.5), tank.dimensions.height*(-0.5), emptyWidth, tank.dimensions.height);
  // Draws a full rectangle whose height indicates remaining health
  ctx.fillRect(tank.dimensions.width*(-0.5) + emptyWidth, tank.dimensions.height*(-0.5), fullWidth, tank.dimensions.height);
  drawArrow(tank);
  ctx.restore();
}

// Draws an arrow on the tank indicating the front of the tank
function drawArrow(tank) {
  ctx.beginPath();
  ctx.translate(0,0);
  ctx.moveTo(-13,0);
  ctx.lineTo(-5,-6);
  ctx.lineTo(-5,6);
  ctx.closePath();
  ctx.fillStyle = tank.color.extra;
  ctx.fill();
}

// Draws the turret on the tank
function drawTurret(tank) {
  ctx.save();
  ctx.translate(tank.coordinates.x,tank.coordinates.y);
  ctx.fillStyle = tank.color.extra;
  ctx.rotate(tank.turretAngle);
  ctx.fillRect(-3,0,6,-30);
  ctx.restore();
}

// Draws bullets
function drawBullets(bulletArray) {
  bulletArray.forEach(function(bullet) {
    ctx.beginPath();
    ctx.arc(bullet.coordinates.x, bullet.coordinates.y, 5, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = 'lime';
    ctx.fill();
  });
}

// Clears the canvas and re-draws the background
function refreshCanvas() {
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}

// Creates the explosion triggered upon death
function dieAnim(dieCenter,explosionColor) {
  if (!deathClockSet) {
    deathClockSet = true;
    setTimeout(function() {
      clearInterval(timer);
      endMessage();
    },2000);
  }
  var grd = ctx.createRadialGradient(dieCenter.x, dieCenter.y, innerRadius, dieCenter.x, dieCenter.y, outerRadius);
  grd.addColorStop(0, explosionColor[0]);
  grd.addColorStop(0.5, explosionColor[1]);
  grd.addColorStop(1, explosionColor[2]);
  ctx.fillStyle = grd;
  ctx.beginPath()
  ctx.arc(dieCenter.x, dieCenter.y, outerRadius, 0, Math.PI*2, true);
  ctx.closePath()
  ctx.fill();
  innerRadius*=1.02;
  outerRadius*=1.03;
}
