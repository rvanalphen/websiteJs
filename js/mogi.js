class Cell{
    //constructing cell properties
    constructor(i,j,r){
        //* i and j are the cell locations
        this.i = i;
        this.j = j;
        // square width
        this.side = r
        //* need to shift cell locations so they are centered
        this.x = (this.i*resolution)+resolution/2
        this.y = (this.j*resolution)+resolution/2;
        //intializing distance
        this.dist = 0
    }

    // Setting this.dist as the real world value of the radial distance 
    // from center canvas to pass to mogi functions 
    setDistance(pix_dist){
        this.dist = pix_dist * scale
    }

    // Calculating fill color value based on the vertical displacment 
    setColor(){
        // Vertical Displacement at each cell 
        disp_z = mogiSource_Vert(this.dist)
        // lowest value 
        m1 = mogiSource_Vert(max_distance*scale)
        // highest value 
        m2 = mogiSource_Vert(min_distance*scale)
        // mapping lowest and highest value to between 0 and 1 
        let clr = map(disp_z,m1,m2,0,1)
        // new value is used to interpolate between two colors to set gradient
        let value = lerpColor(c1, c2, clr);
        // return new rgb color to set as grid fill
         return value
    }
    // Drawing rectangle at grid points and coloring them based on calculation in setColor()
    show(){
        rectMode(CENTER);
        stroke(1);
        fill(this.setColor());
        rect( this.x ,this.y,this.side,this.side);
    }
    showValue(){
        push()
        fill(0)
        noStroke()
        textSize(8);
        text(round(disp_z,3),this.x-9,this.y+4)
        pop()
    }
}
