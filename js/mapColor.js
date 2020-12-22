canvasWidth = 200;
canvasHeight = document.getElementById('sketch-map').clientHeight;
mapWidth = document.getElementById('sketch-map').clientWidth;
function setup() {
    //Creating Canvas and positioning 
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('hold-all');
    canvas.position(mapWidth-1,0)
}

function draw() {
    let offset = 45
    let diameter = 30
    background(100);
    noFill()
    strokeWeight(5)
    rect(0,0,canvasWidth,canvasHeight)
    
    push()
    translate(0,-80)

    //stroke(150)
    fill(255)
    textSize(20)
    text('Thickness (m)',((canvasWidth/2)-60),(canvasHeight/5 - offset))
    
    noStroke()
    rectMode(CENTER)
    fill('#606c38')
    rect(canvasWidth/2,canvasHeight/5,diameter)
    
    noStroke()
    fill(255);
    textSize(14)
    textAlign(CENTER,CENTER)
    text('12m <',canvasWidth/2-offset,(canvasHeight/5))
    
    fill('#283618')
    rect(canvasWidth/2,(canvasHeight/5)*2,diameter)
    fill(255)
    textAlign(CENTER,CENTER)
    text('<= 12m',canvasWidth/2+offset,(canvasHeight/5)*2)
    text('9m <',canvasWidth/2-offset,(canvasHeight/5)*2)
    
    fill('#fefae0')
    rect(canvasWidth/2,(canvasHeight/5)*3,diameter)
    fill(255);
    textAlign(CENTER,CENTER)
    text('<= 9m',canvasWidth/2+offset,(canvasHeight/5)*3)
    text('6m <',canvasWidth/2-offset,(canvasHeight/5)*3)
    
    fill('#bc6c25')
    rect(canvasWidth/2,(canvasHeight/5)*4,diameter)
    fill(255);
    textAlign(CENTER,CENTER)
    text('<= 6m',canvasWidth/2+offset,(canvasHeight/5)*4)
    text('3m <',canvasWidth/2-offset,(canvasHeight/5)*4)
    
    fill('#dda15e')
    rect(canvasWidth/2,(canvasHeight/5)*5,diameter)
    fill(255);
    textAlign(CENTER,CENTER)
    text('<= 3m',canvasWidth/2+offset,(canvasHeight/5)*5)
    
    pop()
}