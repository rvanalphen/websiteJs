let sketch2 = function (z) {


  z.setup = function () {
    var canvas = z.createCanvas(500, 200);;
    canvas.parent("sketch-holder2");
    z.angleMode(z.DEGREES);
    
      
    pl = z.createInput()
    pl.position(170, 35);
    pl.size(50)
    pl.parent("sketch-holder2");
    
    inc = z.createInput()
    inc.position(240, 65);
    inc.size(50)
    inc.parent("sketch-holder2");
  };

  z.draw = function () {
    z.background(220);
  
  
    z.fill(0);
    z.textAlign(z.CENTER)
    z.text("Present Latitude:", 110,50)
    
    z.text("Lambda", 110,110)
    
    z.text("= tan",155,110)
    z.text("-1",180,100)
    z.text("tan",220,80)
  
    
    lx = 200
    ly = 90
    z.line(lx,ly,300,ly)
    z.text("2",220,120)
    z.text("=",320,110)
    
    inclination = inc.value()
    ml = z.calcLat(inclination)
    
    
    z.text("Total movement of :",110,160)
    lat = pl.value()
    z.totalMov(lat,ml)

  };

   z.calcLat= function(value){
    numerator = z.tan(value)
    denominator = 2 
    
    frac = (numerator/denominator)
    
    lam = z.atan(frac)
  
    if (lam){
      z.text(z.round(lam,1),350,110)
      z.text('degrees',400,110)

      return lam
    }
  
  }
  
   z.totalMov = function(lt,la){
      dif = lt-la
      if (lt){
      z.text(z.round(dif,1),200,160)
      z.text('degrees',250,160)
      return lam
    }
  }
}
    


let myp5_2 = new p5(sketch2);
