var ctx;
var firstDeath = true;
var innerRadius = 5;
var outerRadius = 10;
var dieCenter;
var timer;
var deathClockSet = false;

function startGame(myName,myColor,enemyName,enemyColor) {
  ctx = $('#canvas')[0].getContext('2d');
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  myTank = new Tank(myName,myColor);
  enemyTank = new Tank(enemyName,enemyColor);

  $('canvas').on('click', function() {
    if (!myTank.gameOver) {
      myTank.createBullet()
    }
  });

  bullets = [];
  enemyBullets = [];
  timer = setInterval(function() { updateCanvas(myTank,enemyTank) },15);
}

function updateCanvas(myTank,enemyTank) {
  refreshCanvas();
  draw(enemyTank);
  draw(myTank);
  drawBullets(enemyBullets);
  if (myTank.health < 0 && firstDeath) {
    myTank.gameOver = -1;
    dieCenter = myTank.coordinates;
    socket.emit('iLost', dieCenter);
    firstDeath = false;
  }
  if (!myTank.gameOver) {
    myTank.updateTank();
    makeBullets(bullets);
  }
  else {
    dieAnim(dieCenter);
  }
  socket.emit('canvasUpdate', myTank.getAttributes());
  socket.emit('updateBullets',bullets);
}

function makeBullets(bulletArray) {
  bulletArray.forEach(function(bullet) {
    bullet.move();
    var hit = detectCollisions(enemyTank,bullet.coordinates);
    if (hit || bullet.coordinates.x < 0 || bullet.coordinates.x > canvas.width || bullet.coordinates.y < 0 || bullet.coordinates.y > canvas.height) {
      bulletArray.splice(bulletArray.indexOf(bullet),1);
      bullet = null;
      if (hit) {
        socket.emit('takeDamage', 5);
      }
    }
  });
}

function draw(tank) {
  drawTank(tank);
  drawArrow();
  drawTurret(tank);
  if (bullets.length > 0) drawBullets(bullets);
  if (enemyBullets.length > 0) drawBullets(enemyBullets);
}

function drawTank(tank) {
  ctx.save();
  ctx.translate(tank.coordinates.x,tank.coordinates.y);
  ctx.fillStyle = tank.color;
  ctx.rotate(tank.angle);
  ctx.fillRect(tank.dimensions.width*(-0.5),tank.dimensions.height*(-0.5),tank.dimensions.width,tank.dimensions.height);
  drawArrow();
  ctx.restore();
}

function drawArrow() {
  ctx.beginPath();
  ctx.translate(0,0);
  ctx.moveTo(-13,0);
  ctx.lineTo(-5,-6);
  ctx.lineTo(-5,6);
  ctx.closePath();
  ctx.fillStyle = 'green';
  ctx.fill();
}

function drawTurret(tank) {
  ctx.save();
  ctx.translate(tank.coordinates.x,tank.coordinates.y);
  ctx.fillStyle = 'purple';
  ctx.rotate(tank.turretAngle);
  ctx.fillRect(-3,0,6,-30);
  ctx.restore();
}

function drawBullets(bulletArray) {
  bulletArray.forEach(function(bullet) {
    ctx.beginPath();
    ctx.arc(bullet.coordinates.x, bullet.coordinates.y, 5, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
  });
}

function refreshCanvas() {
  ctx.save();
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}

function dieAnim(dieCenter) {
  if (!deathClockSet) {
    deathClockSet = true;
    setTimeout(function() {
      clearInterval(timer);
      endMessage();
    },2000);
  }
  var grd = ctx.createRadialGradient(dieCenter.x, dieCenter.y, innerRadius, dieCenter.x, dieCenter.y, outerRadius);
  grd.addColorStop(0, "yellow");
  grd.addColorStop(0.5, "orange");
  grd.addColorStop(1, "red");
  ctx.fillStyle = grd;
  ctx.beginPath()
  ctx.arc(dieCenter.x, dieCenter.y, outerRadius, 0, Math.PI*2, true);
  ctx.closePath()
  ctx.fill();
  innerRadius*=1.02;
  outerRadius*=1.03;
}
