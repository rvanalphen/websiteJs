let sketch1 = function (p) {
  // code modified from https://medium.com/@aleksanderobuchowski/electric-field-simulation-in-p5-js-6cb9fde551fe
  // modified by Robert Van Alphen on Dec 1, 2021

  var res = 10;
  var grid_X;
  var grid_Y;
  var width = 800;
  var height = 800;
  p.setup = function () {
    var canvas = p.createCanvas(width, height);
    canvas.parent("sketch-holder");
    grid_X = new Array(width / res);
    grid_Y = new Array(width / res);

    for (var i = 0; i < width / res; i++) {
      grid_X[i] = new Array(height / res);
      grid_Y[i] = new Array(height / res);
    }

    x0 = width / 2;
    y0 = height / 2;

    value = 100;
    c1 = new Magnet(x0, y0 - 50, -value);

    c2 = new Magnet(x0, y0 + 30, value);
  };

  p.draw = function () {
    p.background(220);
    p.drawGrid();

    p.fill(50,50)
    p.circle(x0,x0,300)

    c1.display();
    c2.display();

    p.drawArrows(c1.x,c1.y,c1.v,c2.x,c2.y,c2.v);
  };

  p.mousePressed = function () {
    let d = p.dist(p.mouseX, p.mouseY, c1.x, c1.y);
    if (d < c1.dim) {
      c1.clicked = true;
    }

    let d2 = p.dist(p.mouseX, p.mouseY, c2.x, c2.y);
    if (d2 < c2.dim) {
      c2.clicked = true;
    }
  };

  p.mouseReleased = function () {
    c1.clicked = false;
    c2.clicked = false;
  };

  p.mouseDragged = function () {
    if (c1.clicked) {
      c1.x = p.mouseX;
      c1.y = p.mouseY;
    }
    if (c2.clicked) {
      c2.x = p.mouseX;
      c2.y = p.mouseY;
    }
  };

  p.drawGrid = function () {
    p.stroke(0, 50);
    for (var i = 0; i < width; i += 20) {
      p.line(0, i, width, i);
      p.line(i, 0, i, height);
    }
  };

  p.arrows = function (x1, y1, x2, y2) {
    p.line(x1, y1, x2, y2);
    p.push();
    p.translate(x2, y2);
    var a = p.atan2(x1 - x2, y2 - y1);
    p.rotate(a);
    p.line(0, 0, -5, -5);
    p.line(0, 0, 5, -5);
    p.pop();
  };

  p.drawArrows = function (pos1x,pos1y,v1,pos2x,pos2y,v2) {
    for (var i = 0; i < width+20; i += 30) {
      for (var j = 0; j < height; j += 30) {
        x = i;
        y = j;
        length = 50
        dx = x - pos1x;
        dy = y - pos1y;
        d1 = p.sqrt(dx * dx + dy * dy);
        E1 = v1 / (d1 * d1);
        E1x = (dx * E1) / d1;
        E1y = (dy * E1) / d1;

        dxn = x - pos2x;
        dyn = y - pos2y;
        d2 = p.sqrt(dxn * dxn + dyn * dyn);
        E2 = v2 / (d2 * d2);
        E2x = (dxn * E2) / d2;
        E2y = (dyn * E2) / d2;

        EEx = E1x + E2x;
        EEy = E1y + E2y;
        EE = p.sqrt(EEx * EEx + EEy * EEy);

        deltax = (length * EEx) / EE;
        deltay = (length * EEy) / EE;

        // console.log(dx)
        p.strokeWeight(2);
        if (i % 60 == 0 && j % 60 == 0){
          p.stroke(0, 200);
          p.arrows(x, y, x + deltax, y + deltay);
        }else{
          p.stroke(70, 200);
          p.arrows(x, y, x + deltax, y + deltay);
        }
      }
    }
  };

  class Magnet {
    constructor(x, y, v) {
      this.x = x;
      this.y = y;
      this.v = v;
      this.dim = 30;
      this.clicked = false;
      this.t = "";

      if (this.v > 0) {
        this.col = p.color(255, 0, 0, 100);
        this.t = "+";
      } else if (this.v < 0) {
        this.col = p.color(0, 0, 255, 100);
        this.t = "-";
      }
    }

    display() {
      p.fill(255);
      p.rectMode(p.CENTER);

      p.stroke(0);
      p.fill(this.col);
      p.strokeWeight(1);
      p.rect(this.x, this.y, this.dim, this.dim);

      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.t, this.x + 0.2, this.y - 1.7);
    }
  }
};

let myp5 = new p5(sketch1);
