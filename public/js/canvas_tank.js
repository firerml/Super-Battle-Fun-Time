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
  ctx.rotate(tank.angle);
  ctx.fillStyle = tank.color;
  ctx.fillRect(tank.dimensions.width*(-0.5),tank.dimensions.height*(-0.5),tank.dimensions.width,tank.dimensions.height);
  ctx.restore();
}

function refreshCanvas() {
  ctx.save();
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}
