var ctx;

function startGame(myName,myColor,enemyName,enemyColor) {
  ctx = $('#canvas')[0].getContext('2d');
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  myTank = new Tank(myName,myColor);
  enemyTank = new Tank(enemyName,enemyColor);
  $('canvas').on('click', function() {
    myTank.createBullet()
  });
  bullets = [];

  setInterval(function() { updateCanvas(myTank,enemyTank) },15);

}

function updateCanvas(myTank,enemyTank) {
  refreshCanvas();
  draw(myTank);
  draw(enemyTank);
  myTank.updateTank();
  bullets.forEach(function(bullet) {
    console.log(bullet.angle);
    bullet.move();
  });
  socket.emit('canvasUpdate', myTank.getAttributes());
}

function draw(tank) {
  drawTank(tank);
  drawArrow();
  drawTurret(tank);
  if (bullets.length > 0) drawBullets();
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

function drawBullets() {
  console.log(bullets[0].coordinates);
  bullets.forEach(function(bullet) {
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

// module.exports = startGame()
