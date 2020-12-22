let sketch1 = function (p) {

    //! Animation Scale
    let timescale = 0.01; // 1sec = 0.01 time step to slow down animation
    //! Stream Variables
    let streamX = 0; // want the stream at the bottom left corner 
    let streamScale = 100; // 1m = 100px
    let depth = -2 * streamScale // scaling stream depth to pixel space 
    let current = 0; // stream cross current 
    //! Stone Variables
    let stoneScale = 5 // 1 mm = 5px 
    let diameter = 1 * stoneScale; //scaling stone diameter to pixel space 
    let settleVAir = 3 // m/s
    let settleVWater = 1 // m/s
    //!Set canvas dimensions and color
    let canvasWidth = 700;
    let canvasHeight = 400;
    let bkgrd;
    //!Set parameters for stone drop location
    let dropWidth = 2; //dividing canvasWidth by this number 
    let dropHeight = 150; //pixels above stream top 
    //!setting image variables 
    let img;

    // preloading images so they are loaded first 
    p.preload = function () {
        img0 = p.loadImage('https://raw.githubusercontent.com/rvanalphen/code/master/images/background.JPG');
    }

    p.setup = function () {
        //Creating Canvas and positioning 
        var canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent('sketch-holder');

        // Creating Button to start animation
        button0 = p.createButton('Drop');
        button0.parent('sketch-holder');
        button0.position(canvas.width - canvas.width, canvas.height);

        // Creating Button to restart animation
        button = p.createButton('Pick Up');
        button.parent('sketch-holder');
        button.position(button0.width, canvas.height, canvas.height);

        // Creating checkbox to set "fancy mode" aka background as an image
        checkbox = p.createCheckbox(' Fancy Mode', false);
        checkbox.parent('sketch-holder');
        checkbox.position(button.width + 65, canvas.height + 4)

        //* Initializing the stream and stone and passing in variables 
        stream = new Stream(streamX, canvasHeight, canvasWidth, depth, current);
        let StoneX = canvasWidth / dropWidth;
        let StoneY = (canvasHeight + stream.height - dropHeight);
        stone = new Stone(StoneX, StoneY, diameter, settleVAir, settleVWater);

        //* defining function to reset stone via button press
        p.restart = function () {
            stone.x = StoneX;
            stone.y = StoneY;
            p.noLoop();
        }
        //* buttons called on pressing them and calling function inside
        button.mousePressed(p.restart)
        button0.mousePressed(p.start)

        // noLoop(); stops draw(); from starting, calling start will start loop();
        p.noLoop();
    }

    p.draw = function () {
        if (checkbox.checked()) {
            //* setting the background as an image of a stream cross section 
            p.background(img0)
        } else {
            //*visualizing background of value 200, and showing the stream rectangle
            bkgrd = 200;
            p.background(bkgrd);
            stream.show();
        }

        //* visualizing stone
        stone.show();;

        //* Checking the stone is withing the canvas 
        stone.bounds();
        //! sending settling velocity to Stream object and calculating displacment of the stone
        displacment = stream.flow(stone.drop())
        //! if the stone is not at the bottom add the x and y displacment to update the stones position
        if (stone.y < canvasHeight - (stone.dia / 2)) {
            stone.update(displacment)
        }
    }

    //! function to start the loop 
    p.start = function () {
        p.loop();
    }

    //! creating class for the stream to drop the particles in
    class Stream {
        //* constructor to set variables
        //* x, y, diameter,width height and cross current velocity 
        constructor(x, y, w, h, c) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h
            this.crossCurrent = c
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
            if (stone.y < stream.y + stream.height) {
                x_dis = 0
            } else {
                x_dis = this.crossCurrent * streamScale * timescale;
            }
            y_dis = stone.settlingVelocity * streamScale * timescale;

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
            p.fill(255, 255, 0)
            p.circle(this.x, this.y, this.dia)
        }
        //* function taking the displacment input calculated in the stream object
        //* and adding them to the position to move the stone 
        update(displacment) {
            this.y += displacment[0];
            this.x += displacment[1];
        };
        //* function to check that the stone stays inside the canvas 
        bounds() {
            if (this.y >= canvasHeight - (this.dia / 2)) {
                this.y = canvasHeight - (this.dia / 2);
            }
            if (this.y < (this.dia / 2)) {
                this.y = (this.dia / 2);
            }
            if (this.x >= canvasWidth - (this.dia / 2)) {
                this.x = canvasWidth - (this.dia / 2);

            }
            if (this.x < (this.dia / 2)) {
                this.x = (this.dia / 2);
            }
        }
        //* function to set the settling velocity depending on if the 
        //* stone is in the water or not. Arbitrarily set the air velocity as 3m/s
        drop() {
            if (stone.y < stream.y + stream.height) {
                stone.settlingVelocity = this.velocityAir
            } else {
                stone.settlingVelocity = this.velocityWater
            }
        }
    }


};


let sketch2 = function (p2) {

    //! Animation Scale
    let timescale = 0.01; // 1sec = 0.01 time step to slow down animation
    //! Stream Variables
    let streamX = 0; // want the stream at the bottom left corner 
    let streamScale = 100; // 1m = 100px
    let depth = -2 * streamScale // scaling stream depth to pixel space 
    let current = 2; // stream cross current 
    //! Stone Variables
    let stoneScale = 5 // 1 mm = 5px 
    let diameter = 1 * stoneScale; //scaling stone diameter to pixel space 
    let settleVAir = 3 // m/s
    let settleVWater = 1 // m/s
    //!Set canvas dimensions and color
    let canvasWidth = 700;
    let canvasHeight = 400;
    let bkgrd;
    //!Set parameters for stone drop location
    let dropWidth = 3; //dividing canvasWidth by this number 
    let dropHeight = 150; //pixels above stream top 
    //!setting image variables 
    let img;

    // preloading images so they are loaded first 
    p2.preload = function () {
        img0 = p2.loadImage('https://raw.githubusercontent.com/rvanalphen/code/master/images/background.JPG');
    }

    p2.setup = function () {
        //Creating Canvas and positioning 
        var canvas = p2.createCanvas(canvasWidth, canvasHeight);
        canvas.parent('sketch-holder2');

        // Creating Button to start animation
        button0 = p2.createButton('Drop');
        button0.parent('sketch-holder2');
        button0.position(canvas.width - canvas.width, canvas.height);

        // Creating Button to restart animation
        button = p2.createButton('Pick Up');
        button.parent('sketch-holder2');
        button.position(button0.width, canvas.height, canvas.height);

        // Creating checkbox to set "fancy mode" aka background as an image
        checkbox = p2.createCheckbox(' Fancy Mode', false);
        checkbox.parent('sketch-holder2');
        checkbox.position(button.width + 65, canvas.height + 4)

        //* Initializing the stream and stone and passing in variables 
        stream = new Stream(streamX, canvasHeight, canvasWidth, depth, current);
        let StoneX = canvasWidth / dropWidth;
        let StoneY = (canvasHeight + stream.height - dropHeight);
        stone = new Stone(StoneX, StoneY, diameter, settleVAir, settleVWater);

        //* defining function to reset stone via button press
        p2.restart = function () {
            stone.x = StoneX;
            stone.y = StoneY;
            p2.noLoop();
        }
        //* buttons called on pressing them and calling function inside
        button.mousePressed(p2.restart)
        button0.mousePressed(p2.start)

        // noLoop(); stops draw(); from starting, calling start will start loop();
        p2.noLoop();
    }

    p2.draw = function () {
        if (checkbox.checked()) {
            //* setting the background as an image of a stream cross section 
            p2.background(img0)
        } else {
            //*visualizing background of value 200, and showing the stream rectangle
            bkgrd = 200;
            p2.background(bkgrd);
            stream.show();
        }

        //* visualizing stone
        stone.show();;

        //* Checking the stone is withing the canvas 
        stone.bounds();
        //! sending settling velocity to Stream object and calculating displacment of the stone
        displacment = stream.flow(stone.drop())
        //! if the stone is not at the bottom add the x and y displacment to update the stones position
        if (stone.y < canvasHeight - (stone.dia / 2)) {
            stone.update(displacment)
        }
    }

    //! function to start the loop 
    p2.start = function () {
        p2.loop();
    }

    //! creating class for the stream to drop the particles in
    class Stream {
        //* constructor to set variables
        //* x, y, diameter,width height and cross current velocity 
        constructor(x, y, w, h, c) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h
            this.crossCurrent = c
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
            if (stone.y < stream.y + stream.height) {
                x_dis = 0
            } else {
                x_dis = this.crossCurrent * streamScale * timescale;
            }
            y_dis = stone.settlingVelocity * streamScale * timescale;

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
            p2.fill(255, 255, 0)
            p2.circle(this.x, this.y, this.dia)
        }
        //* function taking the displacment input calculated in the stream object
        //* and adding them to the position to move the stone 
        update(displacment) {
            this.y += displacment[0];
            this.x += displacment[1];
        };
        //* function to check that the stone stays inside the canvas 
        bounds() {
            if (this.y >= canvasHeight - (this.dia / 2)) {
                this.y = canvasHeight - (this.dia / 2);
            }
            if (this.y < (this.dia / 2)) {
                this.y = (this.dia / 2);
            }
            if (this.x >= canvasWidth - (this.dia / 2)) {
                this.x = canvasWidth - (this.dia / 2);

            }
            if (this.x < (this.dia / 2)) {
                this.x = (this.dia / 2);
            }
        }
        //* function to set the settling velocity depending on if the 
        //* stone is in the water or not. Arbitrarily set the air velocity as 3m/s
        drop() {
            if (stone.y < stream.y + stream.height) {
                stone.settlingVelocity = this.velocityAir
            } else {
                stone.settlingVelocity = this.velocityWater
            }
        }
    }
}



















//! P5.js instance mode to use more than one canvas on a html page. 
let myp5 = new p5(sketch1)
let myp5_2 = new p5(sketch2)