var ctx;

function startGame(myName,myColor,enemyName,enemyColor) {
  ctx = $('#canvas')[0].getContext('2d');
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  myTank = new Tank(myName,myColor);
  enemyTank = new Tank(enemyName,enemyColor);

  setInterval(function() { updateCanvas(myTank,enemyTank) },15);

}

function updateCanvas(myTank,enemyTank) {
  refreshCanvas();
  draw(myTank);
  draw(enemyTank);
  myTank.updateTank();
  socket.emit('canvasUpdate', myTank.getAttributes());
}

function draw(tank) {
  ctx.save();
  ctx.translate(tank.coordinates.x,tank.coordinates.y);

  ctx.fillStyle = tank.color;
  ctx.rotate(tank.angle);
  ctx.fillRect(tank.dimensions.width*(-0.5),tank.dimensions.height*(-0.5),tank.dimensions.width,tank.dimensions.height);

  ctx.beginPath()
  ctx.fillStyle = 'black';
  ctx.arc(0,0,5,0,2*Math.PI/180,true);
  ctx.fill()
  ctx.closePath()

  ctx.restore();



  ctx.save();
  ctx.translate(tank.coordinates.x,tank.coordinates.y);
  ctx.fillStyle = 'purple';
  ctx.rotate(tank.turretAngle);
  ctx.fillRect(-3,0,6,-30);
  ctx.restore();
}

function refreshCanvas() {
  ctx.save();
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}
