var ctx;

function startGame() {
  ctx = $('#canvas')[0].getContext('2d');
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'black';
  var tank = new Tank('Mike');

  setInterval(function() { updateCanvas(tank) },15);

}

function updateCanvas(myTank) {
  draw(myTank);
  myTank.updateTank();
}

function draw(myTank) {
  refreshCanvas();
  ctx.save();
  ctx.translate(myTank.coordinates.x,myTank.coordinates.y);
  ctx.rotate(myTank.angle);
  ctx.fillRect(myTank.dimensions.width*(-0.5),myTank.dimensions.height*(-0.5),myTank.dimensions.width,myTank.dimensions.height);
  ctx.restore();
  socket.emit('canvasUpdate',myTank);
}

function refreshCanvas() {
  ctx.save();
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}
