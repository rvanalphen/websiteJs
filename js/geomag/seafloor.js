let sketch3 = function (p) {
  p.t1 = false;

  p.setup = function () {
    p.width = 800;
    p.height = 80;
    var canvas = p.createCanvas(p.width, p.height);
    canvas.parent("sketch3");

    button = p.createButton("Change Profile");
    button.position(5, -390);
    button.parent("sketch3");
    button.mousePressed(p.bool);

    p.trace1 = {
      x: [
        150, 141.17647059, 132.35294118, 123.52941176, 114.70588235,
        105.88235294, 97.05882353, 88.23529412, 79.41176471, 70.58823529,
        61.76470588, 52.94117647, 44.11764706, 35.29411765, 26.47058824,
        17.64705882, 8.82352941, 0, -8.82352941, -17.64705882, -26.47058824,
        -35.29411765, -44.11764706, -52.94117647, -61.76470588, -70.58823529,
        -79.41176471, -88.23529412, -97.05882353, -105.88235294, -114.70588235,
        -123.52941176, -132.35294118, -141.17647059, -150,
      ],

      y: [
        -230, 480, -180, 400, 520, -220, -200, 510, -80, -100, -210, -200, 30,
        -350, 450, 400, 350,

        300,

        350, 400, 500, -250, 230, -150, -130, -120, -135, 400, -140, -230, 300,
        350, -170, 450, -100,
      ],

      type: "scatter",
    };

    p.trace2 = {
      x: [
        -100, -92.85714286, -85.71428571, -78.57142857, -71.42857143,
        -64.28571429, -57.14285714, -50, -42.85714286, -35.71428571,
        -28.57142857, -21.42857143, -14.28571429, -7.14285714, 0, 7.14285714,
        14.28571429, 21.42857143, 28.57142857, 35.71428571, 42.85714286, 50,
        57.14285714, 64.28571429, 71.42857143, 78.57142857, 85.71428571,
        92.85714286, 100,
      ],

      y: [
        -100, 360, -25, 480, -100, -130, 250, -80, -100, -120, -170, -70, -150,
        500,

        470,

        500, -150, -70, -170, -120, -100, -80, 250, -130, -100, 480, -25, 360,
        -100,
      ],

      type: "scatter",
    };

    p.layout = {
      title: "Modeled Magnetic Profile",
      plot_bgcolor: "rgb(220,220,220)",

      xaxis: {
        title: "Distance from Spreading Center",

        showgrid: true,

        zeroline: true,

        linecolor: "rgb(0)",
      },

      yaxis: {
        title: "nanoTesla",

        showline: false,
      },
    };
  };

  p.draw = function () {
    p.background(255);
    p.noFill();
    p.textSize(18)
    p.rect(1, 0, p.width - 2, p.height);
    if (p.t1 == true) {
      p.createTrace1();
      p.data = [p.trace1];
      p.noStroke(0);
      p.text("East Pacific Rise", p.width / 2 -70, 70);
    } else {
      p.createTrace2();
      p.data = [p.trace2];
      p.noStroke(0);
      p.text("Juan De Fuca Ridge", p.width / 2 -80, 70);
    }

    Plotly.newPlot("seafloor", p.data, p.layout);
  };

  p.bool = function () {
    if (p.t1 == false) {
      p.t1 = true;
    } else {
      p.t1 = false;
    }
  };

  p.createTrace1 = function () {
    p.stroke(0);

    p.fill(0);
    p.w0 = 20 + 10;
    p.x0 = 80 + 10;
    p.o = 15 + 10;
    p.rect(p.x0, 0, p.w0, 50);
    p.rect(p.width - p.x0 - p.o, 0, p.w0, 50);

    p.fill(255);
    p.x1 = p.x0 + p.w0;
    p.w1 = 10 + 10;
    p.rect(p.x1, 0, p.w1, 50);
    p.rect(p.width - p.x0 - p.o - p.w1, 0, p.w1, 50);

    p.fill(0);
    p.x2 = p.x0 + p.w0 + p.w1;
    p.w2 = 30 + 10;
    p.rect(p.x2, 0, p.w2, 50);
    p.rect(p.width - p.x0 - p.o - p.w1 - p.w2, 0, p.w2, 50);

    p.fill(255);
    p.x3 = p.x2 + p.w2;
    p.w3 = 25 + 10;
    p.rect(p.x3, 0, p.w3, 50);
    p.rect(p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3, 0, p.w3, 50);

    p.fill(0);
    p.x4 = p.x3 + p.w3;
    p.w4 = 18 + 10;
    p.rect(p.x4, 0, p.w4, 50);
    p.rect(p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4, 0, p.w4, 50);

    p.fill(255);
    p.x5 = p.x4 + p.w4;
    p.w5 = 50 + 10;
    p.rect(p.x5, 0, p.w5, 50);
    p.rect(
      p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4 - p.w5,
      0,
      p.w5,
      50
    );

    p.fill(0);
    p.x6 = p.x5 + p.w5;
    p.w6 = 13 + 10;
    p.rect(p.x6, 0, p.w6, 50);
    p.rect(
      p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4 - p.w5 - p.w6,
      0,
      p.w6,
      50
    );

    p.fill(255);
    p.x7 = p.x6 + p.w6;
    p.w7 = 10 + 10;
    p.rect(p.x7, 0, p.w7, 50);
    p.rect(
      p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4 - p.w5 - p.w6 - p.w7,
      0,
      p.w7,
      50
    );

    p.fill(0);
    p.x8 = p.x7 + p.w7;
    p.w8 = 92 + 10 + 10;
    p.rect(p.x8, 0, p.w8, 50);
  };

  p.createTrace2 = function () {
    p.stroke(0);
    p.fill(0);
    p.w0 = 25 + 10;
    p.x0 = 75 + 10;
    p.o = 10 + 10;
    p.rect(p.x0, 0, p.w0, 50);
    p.rect(p.width - p.x0 - p.o, 0, p.w0, 50);

    p.fill(255);
    p.x1 = p.x0 + p.w0;
    p.w1 = 10 + 10;
    p.rect(p.x1, 0, p.w1, 50);
    p.rect(p.width - p.x0 - p.o - p.w1, 0, p.w1, 50);

    p.fill(0);
    p.x2 = p.x0 + p.w0 + p.w1;
    p.w2 = 30 + 10;
    p.rect(p.x2, 0, p.w2, 50);
    p.rect(p.width - p.x0 - p.o - p.w1 - p.w2, 0, p.w2, 50);

    p.fill(255);
    p.x3 = p.x2 + p.w2;
    p.w3 = 25 + 10;
    p.rect(p.x3, 0, p.w3, 50);
    p.rect(p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3, 0, p.w3, 50);

    p.fill(0);
    p.x4 = p.x3 + p.w3;
    p.w4 = 20 + 10;
    p.rect(p.x4, 0, p.w4, 50);
    p.rect(p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4, 0, p.w4, 50);

    p.fill(255);
    p.x5 = p.x4 + p.w4;
    p.w5 = 65 + 10;
    p.rect(p.x5, 0, p.w5, 50);
    p.rect(
      p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4 - p.w5,
      0,
      p.w5,
      50
    );

    p.fill(0);
    p.x6 = p.x5 + p.w5;
    p.w6 = 15 + 10;
    p.rect(p.x6, 0, p.w6, 50);
    p.rect(
      p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4 - p.w5 - p.w6,
      0,
      p.w6,
      50
    );

    p.fill(255);
    p.x7 = p.x6 + p.w6;
    p.w7 = 15 + 10;
    p.rect(p.x7, 0, p.w7, 50);
    p.rect(
      p.width - p.x0 - p.o - p.w1 - p.w2 - p.w3 - p.w4 - p.w5 - p.w6 - p.w7,
      0,
      p.w7,
      50
    );

    p.fill(0);
    p.x8 = p.x7 + p.w7;
    p.w8 = 55 + 20;
    p.rect(p.x8, 0, p.w8, 50);
  };
};

let myp5_3 = new p5(sketch3);
