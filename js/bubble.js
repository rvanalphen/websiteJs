class Bubble{
    constructor(x,y,mass,moleculeType) {
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.mass = mass;
        if (this.mass== massValue[0]){
            this.mass = massValue[0];
        } else if (this.mass== massValue[1]){
            this.mass = massValue[1];
        } else if (this.mass== massValue[2]){
            this.mass = massValue[2];
        } else {
            print('ERROR: Your this.mass must be one of the predetermined values in the second drop down box')
        }
        this.type = moleculeType
        this.vol = 0;
        this.molMass = 0; 
        this.radius =0;
        this.density = 0; 
        this.r =0;
        this.g =0;
        this.b=255;
        if (this.type === 'H2O'){
            this.molMass = 18.025
        } else if (this.type === 'CO2'){
            this.molMass = 44.009
        } else if (this.type === 'SO2'){
            this.molMass = 64.066
        } else if (this.type === 'F'){
            this.molMass = 18.998
        } else if (this.type === 'Cl'){
            this.molMass = 35.452
        } else {
            print('Your this.type must be one of the predetermined values in the fist drop down box')
        }
        this.mols = this.mass/this.molMass
    }
    
    getProperties(pressure,gasconst,temp){
        if (gasconst == 8.314472 && temp == 1300){
            this.vol = ((this.mols * gasconst * temp)/pressure)
            this.radius = (((this.vol*0.75)/Math.PI)**(1/3))
            this.density = ((this.mass/1000)/this.vol)
        } else {
            print('ERROR: Please set variable gasconts to 8.314472 and temp to 1300 ')
        }
    }   
 
    bounds() {
        if (this.pos.y >= height - (this.radius)) {
            this.pos.y = height - (this.radius);
        } else if (this.pos.y < this.radius) {
            restart();
        } else if (this.pos.y < 0 - this.radius){
            print('ERROR: Bubble is out of bounds possibly from making the velocity too fast?')
        }
    }
    
    applyVelocity(force) {
        if (force.y<=0){
            this.vel.set(0,0)
            this.vel.add(force);
        } else {
            print('ERROR: Your Velocity should be negative to move the bubble up!')
        }
    }

  update(){
    if (this.vel.y <=0){
        this.vel.mult(scale/Tscale)
        this.pos.add(this.vel)
    }else {
        print('ERROR: Your particle needs to move up which means this.vel needs to be negative')
    }
    }
    
    show() {
        fill(this.r,this.g,this.b)
        let diameter = (this.radius * scale)*2
        circle(this.pos.x, this.pos.y,diameter)
    
    }
}