//! Magma properties
//Maybe i can add these to be changed later.  
let magmaDensity = 2500;
let temp = 1300
let magmaViscosity = 1000

//! constants not to change 
//Scales 
let scale = 50 //* 1m = 50px
let Tscale = 2 //* 1sec = 2 timestep 
//Constant for bubble volume
let gasconst = 8.314472
//Arrays for drop down menu dom element 
let volatile = ['H2O', 'CO2', 'SO2', 'F', 'Cl']
let massValue = [10, 25, 50]
//Initializing depth as 0 so it can be changed through animation
let depth;
//initializing varible names of bubble object 
let bubble;

//! DOM elements
//Set canvas extent 
w = 400;
//! Do not change h
h = 450;
//drop down menu (createSelect) variable names and names for the varibales they change
let sel0;
let gas;
let sel;
let bubbleMass;
//start button variable 
let button0;
//image variable 
let img;
let br = 0

let r = 0
let g = 0
let b = 0

// preloading images so they are loaded first 
function preload() {
   img = loadImage('https://raw.githubusercontent.com/rvanalphen/code/master/images/column.JPG');
}

function setup() {
   frameRate(24);
   //Creating canvas and setting parent to div in html
   if (h == 450) {
      canvas = createCanvas(w, h);
      canvas.parent('sketch-holder');
   } else {
      canvas = createCanvas(w, h);
      canvas.parent('sketch-holder');
      print('ERROR: please make the canvas height 450px or else the meter demarcations will be off')
   }
   //Creating two drop down selectors one to change the gas being modeled second to change the mass of the gas
   //changing either selector mid animation will restart it. 
   sel0 = createSelect();
   sel0.parent('sketch-holder');
   sel0.position((width - width), height + 5);
   sel0.option('Water', volatile[0]);
   sel0.option('Carbon Dioxide', volatile[1]);
   sel0.option('Sulfer Dioxide', volatile[2]);
   sel0.option('Fluorine', volatile[3]);
   sel0.option('Chlorine', volatile[4]);
   gas = sel0.value();
   sel0.changed(restart);

   sel = createSelect();
   sel.parent('sketch-holder');
   sel.position(sel0.x + 135, sel0.y);
   sel.option('10g', massValue[0]);
   sel.option('25g', massValue[1]);
   sel.option('50g', massValue[3]);
   bubbleMass = int(sel.value());
   sel.changed(restart2);

   // Creating Button to start animation
   button0 = createButton('Start');
   button0.parent('sketch-holder');
   button0.position(sel.x + 55, sel0.y - 4);

   // Creating checkbox to set "fancy mode" aka background as an image
   checkbox = createCheckbox(' Ascent Speed Graph', false);
   checkbox.parent('sketch-holder');
   checkbox.position(sel0.width + 225, canvas.height + 4)

   //Settling bubble starting positins as center 
   bx = width / 2
   by = height

   //two bubble objects, first is the main bubble being modeled 
   //second is always a water bubble to model for comparison
   bubble = new Bubble(bx, by, bubbleMass, gas);

   //Creates paragraph to visualize change in bubble radius
   p0 = createP();
   p0.parent('sketch-holder');
   p0.position(sel0.x + 250, sel0.y - 15);

   //press function to call start function 
   button0.mousePressed(start)

   var div = document.createElement("div");
   div.setAttribute("id", "myChart");
   div.style.width = "600px";
   div.style.height = height + 'px';
   document.getElementById("sketch-holder").appendChild(div);
   div.style.position = "absolute";
   div.style.left = width + 10 + 'px';
   div.style.top = 0 + 'px';
   trace1 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'H2O',
      line: {
         shape: 'linear'
      }
   }
   trace2 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'CO2',
      line: {
         shape: 'linear'
      },
   };
   trace3 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'SO2'
   };
   trace4 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'F'
   };
   trace5 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'Cl'
   };
   trace6 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'H2O',
      line: {
         shape: 'linear'
      },
   };
   trace7 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'CO2',
      line: {
         shape: 'linear'
      },
   };
   trace8 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'SO2'
   };
   trace9 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'F'
   };
   trace10 = {
      x: [],
      y: [],
      mode: 'lines+markers',
      name: 'Cl'
   };
   layout = {
      title: 'Radius Per Depth',
      width: 600,
      height: height,
      showlegend: true,
      paper_bgcolor: "rgb(255,255,255)",
      plot_bgcolor: "rgb(229,229,229)",
      xaxis: {
         title: 'Depth (m)',
         range: [45, 5],
         tick0: 0,
         dtick: 5,
      },
      yaxis: {
         title: 'Radius (cm)',
         range: [5, 25],
         tick0: 0,
         dtick: 5,
      },
   }
   layout2 = {
      title: 'Velocity Per Depth',
      width: 600,
      height: height,
      showlegend: true,
      paper_bgcolor: "rgb(255,255,255)",
      plot_bgcolor: "rgb(229,229,229)",
      xaxis: {
         title: 'Depth (m)',
         range: [45, 5],
         tick0: 0,
         dtick: 5,
      },
      yaxis: {
         title: 'Ascent Speed (cm/s)',
         range: [0, 30],
         tick0: 0,
         dtick: 5,
      },
   };
   data = [trace1, trace2, trace3, trace4, trace5]
   data2 = [trace6, trace7, trace8, trace9, trace10]

   Plotly.newPlot('myChart', data, layout)

   noLoop();
}
//restart function 
function restart() {
   bubbleMass = int(sel.value());
   gas = sel0.value();
   bubble = new Bubble(bx, by, bubbleMass, gas);
   noLoop();
}

function restart2() {
   if (checkbox.checked()) {
      if (sel.value() != massValue[0]) {
         bubbleMass = int(sel.value());
         gas = sel0.value();
         bubble = new Bubble(bx, by, bubbleMass, gas);
         noLoop();
         Plotly.relayout('myChart', {
            yaxis: {
               title: 'Ascent Speed (cm/s)',
               range: [0, 85],
            }
         });
         trace6 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'H2O',
            line: {
               shape: 'linear'
            },
         };
         trace7 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'CO2',
            line: {
               shape: 'linear'
            },
         };
         trace8 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'SO2'
         };
         trace9 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'F'
         };
         trace10 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Cl'
         };
         data2 = [trace6, trace7, trace8, trace9, trace10]
      } else {
         bubbleMass = int(sel.value());
         gas = sel0.value();
         bubble = new Bubble(bx, by, bubbleMass, gas);
         noLoop();
         Plotly.relayout('myChart', {
            yaxis: {
               title: 'Ascent Speed (cm/s)',
               range: [5, 25],
            }
         });
         trace6 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'H2O',
            line: {
               shape: 'linear'
            },
         };
         trace7 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'CO2',
            line: {
               shape: 'linear'
            },
         };
         trace8 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'SO2'
         };
         trace9 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'F'
         };
         trace10 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Cl'
         };
         data2 = [trace6, trace7, trace8, trace9, trace10]
      }
   } else {
      if (sel.value() != massValue[0]) {
         bubbleMass = int(sel.value());
         gas = sel0.value();
         bubble = new Bubble(bx, by, bubbleMass, gas);
         noLoop();
         Plotly.relayout('myChart', {
            yaxis: {
               range: [5, 40],
            }
         });
         trace1 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'H2O',
            line: {
               shape: 'linear'
            }
         };
         trace2 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'CO2',
            line: {
               shape: 'linear'
            },
         };
         trace3 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'SO2'
         };
         trace4 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'F',
         };
         trace5 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Cl'
         };
         data = [trace1, trace2, trace3, trace4, trace5]
      } else {
         bubbleMass = int(sel.value());
         gas = sel0.value();
         bubble = new Bubble(bx, by, bubbleMass, gas);
         noLoop();
         Plotly.relayout('myChart', {
            yaxis: {
               range: [5, 25],
            }
         });
         trace1 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'H2O',
            line: {
               shape: 'linear'
            }
         };
         trace2 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'CO2',
            line: {
               shape: 'linear'
            },
         };
         trace3 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'SO2'
         };
         trace4 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'F',
         };
         trace5 = {
            x: [],
            y: [],
            mode: 'lines+markers',
            name: 'Cl'
         };
         data = [trace1, trace2, trace3, trace4, trace5]
      }
   }
}
//start function
function start() {
   bubbleMass = int(sel.value());
   gas = sel0.value();

   bubble = new Bubble(bx, by, bubbleMass, gas);
   loop();
}

function draw() {
   background(img);

   if (checkbox.checked()) {
      Plotly.newPlot('myChart', data2, layout2)
   } else {
      Plotly.newPlot('myChart', data, layout)
   }
   lx = 0;
   ly = height - 50;
   rwidth = width;
   rheight = 5;

   fill(r, g, b);
   rect(lx, ly - 402, rwidth, rheight);
   rect(lx, ly - 350, rwidth, rheight);
   rect(lx, ly - 300, rwidth, rheight);
   rect(lx, ly - 250, rwidth, rheight);
   rect(lx, ly - 200, rwidth, rheight);
   rect(lx, ly - 150, rwidth, rheight);
   rect(lx, ly - 100, rwidth, rheight);
   rect(lx, ly - 50, rwidth, rheight);
   rect(lx, ly, rwidth, rheight);
   rect(lx, ly + 47, rwidth, rheight);

   fill(0);
   textSize(20);
   text('5m', width - 30, ly - 355);
   text('10m', width - 40, ly - 305);
   text('15m', width - 40, ly - 255);
   text('20m', width - 40, ly - 205);
   text('25m', width - 40, ly - 155);
   text('30m', width - 40, ly - 105);
   text('35m', width - 40, ly - 55);
   text('40m', width - 40, ly - 2);
   text('45m', width - 40, ly + 48);

   gravity = createVector(0, 9.8);
   pressure = magmaDensity * depth * gravity.y;
   bubble.getProperties(pressure, gasconst, temp);
   calcVelocity(bubble);
   bubble.update();
   setDepth(bubble);
   graphData(bubble)
   bubble.bounds();
   bubble.show();
}

function calcVelocity(particle) {
   p = particle
   rad = p.radius
   //! gravity force 
   gravity.mult(p.mass / 1000);

   //! bouyacny force 
   rhoContrast = (magmaDensity) / (p.density) // bubble density already scalled
   secondGrav = createVector(0, 9.8)
   secondGrav.mult(p.mass / 1000);
   secondGrav.mult(rhoContrast);

   //! terminal velocity 
   numerator = p5.Vector.sub(secondGrav, gravity);
   denominator = 6 * Math.PI * (magmaViscosity) * rad;
   numerator.div(denominator);

   terminalVelocity = numerator.copy();
   terminalVelocity.mult(-1);
   p.applyVelocity(terminalVelocity);
}

function setDepth(particle) {
   let wtr = particle
   if (wtr.pos.y > ly) {
      depth = 45;
   } else if (wtr.pos.y < ly && wtr.pos.y > ly - 50) {
      depth = 40;
   } else if (wtr.pos.y < ly - 50 && wtr.pos.y > ly - 100) {
      depth = 35;
   } else if (wtr.pos.y < ly - 100 && wtr.pos.y > ly - 150) {
      depth = 30;
   } else if (wtr.pos.y < ly - 150 && wtr.pos.y > ly - 200) {
      depth = 25;
   } else if (wtr.pos.y < ly - 200 && wtr.pos.y > ly - 250) {
      depth = 20;
   } else if (wtr.pos.y < ly - 250 && wtr.pos.y > ly - 300) {
      depth = 15;
   } else if (wtr.pos.y < ly - 300 && wtr.pos.y > ly - 350) {
      depth = 10;
   } else {
      depth = 5;
   }
}

function graphData(particle) {
   let pr = particle
   if (pr.pos.y > ly) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly && pr.pos.y > ly - 50) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly - 50 && pr.pos.y > ly - 100) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly - 100 && pr.pos.y > ly - 150) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly - 150 && pr.pos.y > ly - 200) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly - 200 && pr.pos.y > ly - 250) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly - 250 && pr.pos.y > ly - 300) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else if (pr.pos.y < ly - 300 && pr.pos.y > ly - 350) {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   } else {
      if (checkbox.checked()) {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round((bubble.vel.y / 25) * -100, 2)]
               ]
            }, [4])
         }
      } else {
         if (pr.type === 'H2O') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [0])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [0])
         } else if (pr.type === 'CO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [1])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [1])
         } else if (pr.type === 'SO2') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [2])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [2])
         } else if (pr.type === 'F') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [3])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [3])
         } else if (pr.type === 'Cl') {
            Plotly.extendTraces('myChart', {
               x: [
                  [depth]
               ]
            }, [4])
            Plotly.extendTraces('myChart', {
               y: [
                  [round(bubble.radius * 100, 2)]
               ]
            }, [4])
         }
      }
      setData();
   }
}

function setData() {
   if (checkbox.checked()) {
      let charsX_0 = data2[0].x;
      data2[0].x = [...new Set(charsX_0)];
      let charsX_1 = data2[1].x;
      data2[1].x = [...new Set(charsX_1)];
      let charsX_2 = data2[2].x;
      data2[2].x = [...new Set(charsX_2)];
      let charsX_3 = data2[3].x;
      data2[3].x = [...new Set(charsX_3)];
      let charsX_4 = data2[4].x;
      data2[4].x = [...new Set(charsX_4)];

      let charsY_0 = data2[0].y;
      data2[0].y = [...new Set(charsY_0)];
      let charsY_1 = data2[1].y;
      data2[1].y = [...new Set(charsY_1)];
      let charsY_2 = data2[2].y;
      data2[2].y = [...new Set(charsY_2)];
      let charsY_3 = data2[3].y;
      data2[3].y = [...new Set(charsY_3)];
      let charsY_4 = data2[4].y;
      data2[4].y = [...new Set(charsY_4)];
   } else {
      let charsX_0 = data[0].x;
      data[0].x = [...new Set(charsX_0)];
      let charsX_1 = data[1].x;
      data[1].x = [...new Set(charsX_1)];
      let charsX_2 = data[2].x;
      data[2].x = [...new Set(charsX_2)];
      let charsX_3 = data[3].x;
      data[3].x = [...new Set(charsX_3)];
      let charsX_4 = data[4].x;
      data[4].x = [...new Set(charsX_4)];

      let charsY_0 = data[0].y;
      data[0].y = [...new Set(charsY_0)];
      let charsY_1 = data[1].y;
      data[1].y = [...new Set(charsY_1)];
      let charsY_2 = data[2].y;
      data[2].y = [...new Set(charsY_2)];
      let charsY_3 = data[3].y;
      data[3].y = [...new Set(charsY_3)];
      let charsY_4 = data[4].y;
      data[4].y = [...new Set(charsY_4)];
   }
}

class Bubble {
   constructor(x, y, mass, moleculeType) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.mass = mass;
      if (this.mass == massValue[0]) {
         this.mass = massValue[0];
      } else if (this.mass == massValue[1]) {
         this.mass = massValue[1];
      } else if (this.mass == massValue[2]) {
         this.mass = massValue[2];
      } else {
         print('ERROR: Your this.mass must be one of the predetermined values in the second drop down box')
      }
      this.type = moleculeType
      this.vol = 0;
      this.molMass = 0;
      this.radius = 0;
      this.density = 0;
      this.r = 0;
      this.g = 0;
      this.b = 255;
      if (this.type === 'H2O') {
         this.molMass = 18.025
      } else if (this.type === 'CO2') {
         this.molMass = 44.009
      } else if (this.type === 'SO2') {
         this.molMass = 64.066
      } else if (this.type === 'F') {
         this.molMass = 18.998
      } else if (this.type === 'Cl') {
         this.molMass = 35.452
      } else {
         print('Your this.type must be one of the predetermined values in the fist drop down box')
      }
      this.mols = this.mass / this.molMass
   }

   getProperties(pressure, gasconst, temp) {
      if (gasconst == 8.314472 && temp == 1300) {
         this.vol = ((this.mols * gasconst * temp) / pressure)
         this.radius = (((this.vol * 0.75) / Math.PI) ** (1 / 3))
         this.density = ((this.mass / 1000) / this.vol)
      } else {
         print('ERROR: Please set variable gasconts to 8.314472 and temp to 1300 ')
      }
   }

   bounds() {
      if (this.pos.y >= height - (this.radius)) {
         this.pos.y = height - (this.radius);
      } else if (this.pos.y < this.radius) {
         restart();
      } else if (this.pos.y < 0 - this.radius) {
         print('ERROR: Bubble is out of bounds possibly from making the velocity too fast?')
      }
   }

   applyVelocity(force) {
      if (force.y <= 0) {
         this.vel.set(0, 0)
         this.vel.add(force);
      } else {
         print('ERROR: Your Velocity should be negative to move the bubble up!')
      }
   }

   update() {
      if (this.vel.y <= 0) {
         this.vel.mult(scale / Tscale)
         this.pos.add(this.vel)
      } else {
         print('ERROR: Your particle needs to move up which means this.vel needs to be negative')
      }
   }

   show() {
      fill(this.r, this.g, this.b)
      let diameter = (this.radius * scale) * 2
      circle(this.pos.x, this.pos.y, diameter)

   }
}