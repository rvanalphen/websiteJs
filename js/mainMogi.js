//! distance and mogi visualizaton radius scale
let scale = 10 //10px = 1m
//! canvas size
let canvasWidth = 650
let canvasHeight = 500
//! grid size
let gridWidth = 500
let gridHeight = 500
//! resolution to divide grid size by
let resolution = 25
//! initializing cell object
let cells;
//! initializing grid array to put cells in
let grid = []
//! width to make cell square visualization
let side = 20
//! initializing mogi source depth, chamber radius, and displacemnt 
let depthCenter = 0 //m
const chamberRadius = 1000 //m
let disp_z;
//! initializing minimum and maximum vertical offset
let m1; // low 
let m2; // high
//! initializing slider element 
let slider;

function setup() {
    //Creating Canvas and positioning 
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-holder');
    
    //*Creating and placing slider that changes mogi depth
    slider = createSlider(2000,6000,5000,1000)
    let sliderX = -110
    let sliderY = canvasHeight-slider.width/2
    slider.parent('sketch-holder');
    slider.style('-webkit-transform: scaleX(-1);')
    slider.style('transform: rotate(90deg);')
    slider.position(sliderX,sliderY)
    depthCenter = slider.value()
    slider.changed(changeVal)
    
    //* setting colors for color scale    
    c1 = color(0, 127, 95); // Green - low Values 
    c2 = color(255, 255, 63); // Yellow - High Values
    
    //* setting columns and rows to make cells
    columns = floor(gridWidth/resolution)
    rows = floor(gridHeight/resolution)
    
    //* running through rows and columns creating cells and 
    //* putting them in array
    for (var j = 0; j < rows; j++){
        for (var i = 0; i < columns; i++){
            cells = new Cell(i,j,side)
            grid.push(cells)
        }
    }
    
    //*Center where mogi is 
    sx = gridWidth/2
    sy = gridHeight/2
    distFromEdge = grid[0].x
    
    //* finding distance from center of cell to edge of canvas
    max_distance = dist(sx,sy,grid[0].x,grid[0].y);
    
    //* finding distance from center of cell to center of canvas
    min_distance = dist(sx, sy, sx-distFromEdge, sy-distFromEdge);
    
    // creating div elements to visualize slider and color gradient values
    let unit1= createDiv('Vertical Displacment (m)')
    unit1.style('font-size: 18px;')
    unit1.parent('sketch-holder')
    unit1.position(gridWidth+35,(canvasHeight/2-10))
    unit1.style('transform: rotate(90deg);')


    let divX = -85
    let divY = 40
    
    let d0= createDiv('2000m')
    d0.parent('sketch-holder')
    d0.position(divX,340)

    let d1= createDiv('3000m')
    d1.parent('sketch-holder')
    d1.position(divX,380)

    let d2= createDiv('4000m')
    d2.parent('sketch-holder')
    d2.position(divX,420)

    let d3= createDiv('5000m')
    d3.parent('sketch-holder')
    d3.position(divX,460)

    let d4= createDiv('6000m')
    d4.parent('sketch-holder')
    d4.position(divX,d3.y+divY)

    let unit0= createDiv('Mogi Source Depth')
    unit0.size(80,50)
    unit0.parent('sketch-holder')
    unit0.position(divX+35,d0.y-(divY+30))

    // Creating checkbox to set "fancy mode" aka background as an image
    checkbox = createCheckbox(' Show Displacment',false);
    checkbox.parent('sketch-holder');
    checkbox.position((canvasWidth-canvasWidth),canvasHeight+5)
}

function draw(){
    //drawing background same as css background color
    background(68)
    
    //visualizing mogi source 
    push()
    stroke(0)
    strokeWeight(2)
    fill(255,0,0)
    circle(sx,sy,chamberRadius/scale)
    pop()

    //* running through grid 
    for (var k = 0; k < grid.length; k++){
        //! visualizing each cell 
        grid[k].show()
        //! calculating distance from center to each grid
        pixel_dist = dist(sx, sy, grid[k].x, grid[k].y);
        //! sending the distance of each cell to the cell constructor
        grid[k].setDistance(pixel_dist)

        if (checkbox.checked()){
            grid[k].showValue()
        }
    }
   
    //* calling function that visualizes the color gradient used to show vertical displacment
    showGradient(gridWidth + 45, (canvasHeight-canvasHeight) + 35, 50, canvasHeight-75, c2, c1)
    //visualizing high and low values that bound the gradient
    fill(255)
    noStroke()
    textSize(16);
    highValue = str(round(m2,4))
    lowValue = str(round(m1,4))
    text(round(highValue,3)+'m',gridWidth+40,(canvasHeight-canvasHeight) + 25)
    text(round(lowValue,3)+'m',gridWidth+40,canvasHeight-10)

}

// function that sets the depth of the mogi source
function changeVal(){
    depthCenter = slider.value()
}

// function that calculates and returns the vertical displacment
//! uses SI units 
function mogiSource_Vert(calculated_dist){
    let depth = depthCenter //m
    let radialDistance = calculated_dist //m
    const deltaP = 2 * (10**7) //Pa
    const elasticModulus = 3 * (10**10) //Pa

    numerator = (3*deltaP*depth*(chamberRadius**3));
    denominator = (4*elasticModulus*(depth**2 + radialDistance**2)**1.5)
    verticalDisplacmnet = numerator/denominator
     return verticalDisplacmnet
}

// function that sets the color gradient to a line and puts multiple
// lines together to look like a single bar 
function showGradient(x, y, w, h, c1, c2) {
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
}
