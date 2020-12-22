let bkgd = (235, 209, 178);
let dChosen = false
let mChosen = false
let start = 0
let y = 818

function preload() {
    orth = loadImage('https://raw.githubusercontent.com/rvanalphen/imageHosting/master/images/ortho.png')
    scale_bar = loadImage('https://raw.githubusercontent.com/rvanalphen/imageHosting/master/images/orthoScale.png')
    compass = loadImage('https://raw.githubusercontent.com/rvanalphen/imageHosting/master/images/orthoDir.PNG')
    dem = loadImage('https://raw.githubusercontent.com/rvanalphen/imageHosting/master/images/elev.PNG')
    demScale = loadImage('https://raw.githubusercontent.com/rvanalphen/imageHosting/master/images/elevScale.PNG')

}

function setup() {
    ww = orth.width;
    hh = orth.height+100;
    
    canvas = createCanvas(ww, hh);
    canvas.parent('holder')
    
    slider = createSlider(0, 255, start, 5);
    slider.parent('holder')
    slider.position(0, hh - 90)
    checkbox = createCheckbox('DEM on', false);
    checkbox.parent('holder')
    checkbox.position(slider.x+180, slider.y)

    fill(100);
    strokeWeight(1);
    rect(slider.x, 755, 265, 40);

}

function draw() {
    imageMode(CORNER);
    image(orth, 0, 0);
    
    fill(240);
    strokeWeight(1);
    rect(ww-250, 520, 200, 225);

    image(scale_bar, ww-180, hh-150);
    image(compass, ww-180, hh-220);

   

    if (checkbox.checked()) {
        tint(255, slider.value());
        image(dem, -4, -5);
        tint(255, 255);
        fill(240);
        strokeWeight(1);
        rect(ww-250, 520, 200, 225);
        image(scale_bar, ww-180, hh-150);
        image(compass, ww-180, hh-220);
        image(demScale, ww-230, hh-310);
    }
}