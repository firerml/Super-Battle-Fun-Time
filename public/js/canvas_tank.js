var ctx;

$(function() {
  startGame();
});

function startGame() {
  ctx = $('#canvas')[0].getContext('2d');
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'black';
  var tank = new Tank('Mike');

  setInterval(drawCanvas,15);

}

function drawCanvas(myTank) {
  refreshCanvas();
  drawTank();
  myTank.updateTank();
}

function drawTank(myTank) {
  ctx.save();
  ctx.translate(myTank.coordinates.x,myTank.coordinates.y);
  ctx.rotate(myTank.angle);
  ctx.fillRect(myTank.dimensions.width*(-0.5),myTank.dimensions.height*(-0.5),myTank.dimensions.width,myTank.dimensions.height);
  ctx.restore();
}

function refreshCanvas() {
  ctx.save();
  ctx.fillStyle = 'lavender';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.restore();
}
