var Wall = function(tLX, tLY, width, height) {
  // the anchor is the top-left corner. More useful than the center
  this.anchor = {x: tLX, y: tLY};
  this.width = width;
  this.height = height;
}

Wall.prototype.getCorners = function() {
  var tL = { x: this.anchor.x, y: this.anchor.y };
  var tR = { x: this.anchor.x + this.width, y: this.anchor.y };
  var bR = { x: this.anchor.x + this.width, y: this.anchor.y + this.height };
  var bL = { x: this.anchor.x, y: this.anchor.y + this.height };
  return {tL: tL, tR: tR, bR: bR, bL: bL};
}
