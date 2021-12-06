let sketch1 = function (p) {
  //! Animation Scale
  p.timescale = 0.01; // 1sec = 0.01 time step to slow down animation
  //! Stream Variables
  p.streamX = 0; // want the stream at the bottom left corner
  p.streamScale = 100; // 1m = 100px
  p.depth = -2 * p.streamScale; // scaling stream depth to pixel space
  p.current = 0; // stream cross current
  //! Stone Variables
  p.stoneScale = 5; // 1 mm = 5px
  p.diameter = 1 * p.stoneScale; //scaling stone diameter to pixel space
  p.settleVAir = 3; // m/s
  p.settleVWater = 1; // m/s
  //!Set canvas dimensions and color
  p.canvasWidth = 700;
  p.canvasHeight = 400;
  p.bkgrd;
  //!Set parameters for stone drop location
  p.dropWidth = 2; //dividing canvasWidth by this number
  p.dropHeight = 150; //pixels above stream top

  // preloading images so they are loaded first
  p.preload = function () {
    img0 = p.loadImage(
      "https://raw.githubusercontent.com/rvanalphen/code/master/images/background.JPG"
    );
  };

  p.setup = function () {
    //Creating Canvas and positioning
    var canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
    canvas.parent("sketch-holder");

    // Creating Button to start animation
    p.button0 = p.createButton("Drop");
    p.button0.parent("sketch-holder");
    p.button0.position(canvas.width - canvas.width, canvas.height);

    // Creating Button to restart animation
    p.button = p.createButton("Pick Up");
    p.button.parent("sketch-holder");
    p.button.position(p.button0.width, canvas.height, canvas.height);

    // Creating checkbox to set "fancy mode" aka background as an image
    p.checkbox = p.createCheckbox(" Fancy Mode", false);
    p.checkbox.parent("sketch-holder");
    p.checkbox.position(p.button.width + 65, canvas.height + 4);

    //* Initializing the stream and stone and passing in variables
    p.stream = new Stream(
      p.streamX,
      p.canvasHeight,
      p.canvasWidth,
      p.depth,
      p.current
    );
    let StoneX = p.canvasWidth / p.dropWidth;
    let StoneY = p.canvasHeight + p.stream.height - p.dropHeight;
    p.stone = new Stone(StoneX, StoneY, p.diameter, p.settleVAir, p.settleVWater);

    //* defining function to reset stone via button press
    p.restart = function () {
        p.stone.x = StoneX;
        p.stone.y = StoneY;
      p.noLoop();
    };
    //* buttons called on pressing them and calling function inside
    p.button.mousePressed(p.restart);
    p.button0.mousePressed(p.start);

    // noLoop(); stops draw(); from starting, calling start will start loop();
    p.noLoop();
  };

  p.draw = function () {
    if (p.checkbox.checked()) {
      //* setting the background as an image of a stream cross section
      p.background(img0);
    } else {
      //*visualizing background of value 200, and showing the stream rectangle
      p.bkgrd = 200;
      p.background(p.bkgrd);
      p.stream.show();
    }

    //* visualizing stone
    p.stone.show();

    //* Checking the stone is withing the canvas
    p.stone.bounds();
    //! sending settling velocity to Stream object and calculating displacment of the stone
    displacment = p.stream.flow(p.stone.drop());
    //! if the stone is not at the bottom add the x and y displacment to update the stones position
    if (p.stone.y < p.canvasHeight - p.stone.dia / 2) {
        p.stone.update(displacment);
    }
  };

  //! function to start the loop
  p.start = function () {
    p.loop();
  };

  //! creating class for the stream to drop the particles in
  class Stream {
    //* constructor to set variables
    //* x, y, diameter,width height and cross current velocity
    constructor(x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.crossCurrent = c;
    }
    //* function to plot the stream as a rectangle
    show() {
      p.fill(0, 0, 255, 50);
      p.rect(this.x, this.y, this.width, this.height);
    }
    //* function to set x and y displacment and return it as an array
    //* sets cross current as 0 if the stone is not in the stream
    flow() {
      let y_dis;
      let x_dis;
      if (p.stone.y < p.stream.y + p.stream.height) {
        x_dis = 0;
      } else {
        x_dis = this.crossCurrent * p.streamScale * p.timescale;
      }
      y_dis = p.stone.settlingVelocity * p.streamScale * p.timescale;

      return [y_dis, x_dis];
    }
  }

  //! creating class for the stones or particles to drop
  class Stone {
    //* constructor to set variables
    //* x, y, diameter, and initializing settling velocity
    constructor(x, y, d, va, vw) {
      this.x = x;
      this.y = y;
      this.dia = d;
      this.settlingVelocity = 0;
      this.velocityAir = va;
      this.velocityWater = vw;
    }
    //* function to plot the stone as a circle
    show() {
      p.fill(255, 255, 0);
      p.circle(this.x, this.y, this.dia);
    }
    //* function taking the displacment input calculated in the stream object
    //* and adding them to the position to move the stone
    update(displacment) {
      this.y += displacment[0];
      this.x += displacment[1];
    }
    //* function to check that the stone stays inside the canvas
    bounds() {
      if (this.y >= p.canvasHeight - this.dia / 2) {
        this.y = p.canvasHeight - this.dia / 2;
      }
      if (this.y < this.dia / 2) {
        this.y = this.dia / 2;
      }
      if (this.x >= p.canvasWidth - this.dia / 2) {
        this.x = p.canvasWidth - this.dia / 2;
      }
      if (this.x < this.dia / 2) {
        this.x = this.dia / 2;
      }
    }
    //* function to set the settling velocity depending on if the
    //* stone is in the water or not. Arbitrarily set the air velocity as 3m/s
    drop() {
      if (p.stone.y < p.stream.y + p.stream.height) {
        p.stone.settlingVelocity = this.velocityAir;
      } else {
        p.stone.settlingVelocity = this.velocityWater;
      }
    }
  }
};

let sketch2 = function (p2) {
  //! Animation Scale
  p2.timescale = 0.01; // 1sec = 0.01 time step to slow down animation
  //! Stream Variables
  p2.streamX = 0; // want the stream at the bottom left corner
  p2.streamScale = 100; // 1m = 100px
  p2.depth = -2 * p2.streamScale; // scaling stream depth to pixel space
  p2.current = 2; // stream cross current
  //! Stone Variables
  p2.stoneScale = 5; // 1 mm = 5px
  p2.diameter = 1 * p2.stoneScale; //scaling stone diameter to pixel space
  p2.settleVAir = 3; // m/s
  p2.settleVWater = 1; // m/s
  //!Set canvas dimensions and color
  p2.canvasWidth = 700;
  p2.canvasHeight = 400;
  p2.bkgrd;
  //!Set parameters for stone drop location
  p2.dropWidth = 3; //dividing canvasWidth by this number
  p2.dropHeight = 150; //pixels above stream top
  //!setting image variables

  // preloading images so they are loaded first
  p2.preload = function () {
    img1 = p2.loadImage(
      "https://raw.githubusercontent.com/rvanalphen/code/master/images/background.JPG"
    );
  };

  p2.setup = function () {
    //Creating Canvas and positioning
    var canvas = p2.createCanvas(p2.canvasWidth, p2.canvasHeight);
    canvas.parent("sketch-holder2");

    // Creating Button to start animation
    p2.button0 = p2.createButton("Drop");
    p2.button0.parent("sketch-holder2");
    p2.button0.position(canvas.width - canvas.width, canvas.height);

    // Creating Button to restart animation
    p2.button = p2.createButton("Pick Up");
    p2.button.parent("sketch-holder2");
    p2.button.position(p2.button0.width, canvas.height, canvas.height);

    // Creating checkbox to set "fancy mode" aka background as an image
    p2.checkbox = p2.createCheckbox(" Fancy Mode", false);
    p2.checkbox.parent("sketch-holder2");
    p2.checkbox.position(p2.button.width + 65, canvas.height + 4);

    //* Initializing the stream and stone and passing in variables
    p2.stream = new Stream(
      p2.streamX,
      p2.canvasHeight,
      p2.canvasWidth,
      p2.depth,
      p2.current
    );
    let StoneX = p2.canvasWidth / p2.dropWidth;
    let StoneY = p2.canvasHeight + p2.stream.height - p2.dropHeight;
    p2.stone = new Stone(
      StoneX,
      StoneY,
      p2.diameter,
      p2.settleVAir,
      p2.settleVWater
    );

    //* defining function to reset stone via button press
    p2.restart = function () {
        p2.stone.x = StoneX;
        p2.stone.y = StoneY;
      p2.noLoop();
    };
    //* buttons called on pressing them and calling function inside
    p2.button.mousePressed(p2.restart);
    p2.button0.mousePressed(p2.start);

    // noLoop(); stops draw(); from starting, calling start will start loop();
    p2.noLoop();
  };

  p2.draw = function () {
    if (p2.checkbox.checked()) {
      //* setting the background as an image of a stream cross section
      p2.background(img1);
    } else {
      //*visualizing background of value 200, and showing the stream rectangle
      p2.bkgrd = 200;
      p2.background(p2.bkgrd);
      p2.stream.show();
    }

    //* visualizing stone
    p2.stone.show();

    //* Checking the stone is withing the canvas
    p2.stone.bounds();
    //! sending settling velocity to Stream object and calculating displacment of the stone
    displacment = p2.stream.flow(p2.stone.drop());
    //! if the stone is not at the bottom add the x and y displacment to update the stones position
    if (p2.stone.y < p2.canvasHeight - p2.stone.dia / 2) {
        p2.stone.update(displacment);
    }
  };

  //! function to start the loop
  p2.start = function () {
    p2.loop();
  };

  //! creating class for the stream to drop the particles in
  class Stream {
    //* constructor to set variables
    //* x, y, diameter,width height and cross current velocity
    constructor(x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.crossCurrent = c;
    }
    //* function to plot the stream as a rectangle
    show() {
      p2.fill(0, 0, 255, 50);
      p2.rect(this.x, this.y, this.width, this.height);
    }
    //* function to set x and y displacment and return it as an array
    //* sets cross current as 0 if the stone is not in the stream
    flow() {
      let y_dis;
      let x_dis;
      if (p2.stone.y < p2.stream.y + p2.stream.height) {
        x_dis = 0;
      } else {
        x_dis = this.crossCurrent * p2.streamScale * p2.timescale;
      }
      y_dis = p2.stone.settlingVelocity * p2.streamScale * p2.timescale;

      return [y_dis, x_dis];
    }
  }

  //! creating class for the stones or particles to drop
  class Stone {
    //* constructor to set variables
    //* x, y, diameter, and initializing settling velocity
    constructor(x, y, d, va, vw) {
      this.x = x;
      this.y = y;
      this.dia = d;
      this.settlingVelocity = 0;
      this.velocityAir = va;
      this.velocityWater = vw;
    }
    //* function to plot the stone as a circle
    show() {
      p2.fill(255, 255, 0);
      p2.circle(this.x, this.y, this.dia);
    }
    //* function taking the displacment input calculated in the stream object
    //* and adding them to the position to move the stone
    update(displacment) {
      this.y += displacment[0];
      this.x += displacment[1];
    }
    //* function to check that the stone stays inside the canvas
    bounds() {
      if (this.y >= p2.canvasHeight - this.dia / 2) {
        this.y = p2.canvasHeight - this.dia / 2;
      }
      if (this.y < this.dia / 2) {
        this.y = this.dia / 2;
      }
      if (this.x >= p2.canvasWidth - this.dia / 2) {
        this.x = p2.canvasWidth - this.dia / 2;
      }
      if (this.x < this.dia / 2) {
        this.x = this.dia / 2;
      }
    }
    //* function to set the settling velocity depending on if the
    //* stone is in the water or not. Arbitrarily set the air velocity as 3m/s
    drop() {
      if (p2.stone.y < p2.stream.y + p2.stream.height) {
        p2.stone.settlingVelocity = this.velocityAir;
      } else {
        p2.stone.settlingVelocity = this.velocityWater;
      }
    }
  }
};

//! P5.js instance mode to use more than one canvas on a html page.
let myp5 = new p5(sketch1);
let myp5_2 = new p5(sketch2);
